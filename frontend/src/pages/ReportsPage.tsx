import { useState, useEffect } from 'react';
import { Typography, Tabs, Table, Card, Statistic, Row, Col, Alert, Spin } from 'antd';
import { WarningOutlined, BookOutlined } from '@ant-design/icons';
import { reportApi } from '../services/api';
import axios from 'axios';

const { Title } = Typography;

interface OverdueLoan {
  maPhieu: string;
  maDocGia: string;
  maSach: string;
  ngayMuon: string;
  hanTra: string;
  trangThai: string;
}

interface InventoryStatus {
  tongSo: number;
  sanSang: number;
  daMuon: number;
  baoTri: number;
  mat: number;
}

export default function ReportsPage() {
  const [overdueLoans, setOverdueLoans] = useState<OverdueLoan[]>([]);
  const [overdueLoading, setOverdueLoading] = useState(false);
  const [overdueError, setOverdueError] = useState<string | null>(null);

  const [inventory, setInventory] = useState<InventoryStatus | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  const fetchOverdue = async () => {
    setOverdueLoading(true);
    setOverdueError(null);
    try {
      const { data } = await reportApi.getOverdue();
      setOverdueLoans(Array.isArray(data) ? data : []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setOverdueError(err.response?.data?.error || 'Lỗi khi tải báo cáo quá hạn');
      } else {
        setOverdueError('Lỗi khi tải báo cáo quá hạn');
      }
    } finally {
      setOverdueLoading(false);
    }
  };

  const fetchInventory = async () => {
    setInventoryLoading(true);
    setInventoryError(null);
    try {
      const { data } = await reportApi.getInventory();
      setInventory(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setInventoryError(err.response?.data?.error || 'Lỗi khi tải báo cáo tình trạng kho');
      } else {
        setInventoryError('Lỗi khi tải báo cáo tình trạng kho');
      }
    } finally {
      setInventoryLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    if (key === 'overdue') fetchOverdue();
    if (key === 'inventory') fetchInventory();
  };

  useEffect(() => { fetchOverdue(); }, []);

  const overdueColumns = [
    { title: 'Mã phiếu', dataIndex: 'maPhieu', key: 'maPhieu' },
    { title: 'Mã độc giả', dataIndex: 'maDocGia', key: 'maDocGia' },
    { title: 'Mã sách', dataIndex: 'maSach', key: 'maSach' },
    { title: 'Ngày mượn', dataIndex: 'ngayMuon', key: 'ngayMuon' },
    { title: 'Hạn trả', dataIndex: 'hanTra', key: 'hanTra' },
  ];

  const tabItems = [
    {
      key: 'overdue',
      label: 'Sách quá hạn',
      children: (
        <>
          {overdueError && <Alert message={overdueError} type="error" showIcon style={{ marginBottom: 16 }} />}
          <Table
            columns={overdueColumns}
            dataSource={overdueLoans}
            rowKey="maPhieu"
            loading={overdueLoading}
            locale={{ emptyText: 'Không có sách quá hạn' }}
            pagination={{ pageSize: 10 }}
          />
        </>
      ),
    },
    {
      key: 'inventory',
      label: 'Tình trạng kho',
      children: (
        <>
          {inventoryError && <Alert message={inventoryError} type="error" showIcon style={{ marginBottom: 16 }} />}
          {inventoryLoading ? (
            <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
          ) : inventory ? (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Tổng số sách" value={inventory.tongSo} prefix={<BookOutlined />} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Sẵn sàng" value={inventory.sanSang} valueStyle={{ color: '#3f8600' }} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Đang mượn" value={inventory.daMuon} valueStyle={{ color: '#faad14' }} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Bảo trì" value={inventory.baoTri} valueStyle={{ color: '#1890ff' }} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Mất" value={inventory.mat} prefix={<WarningOutlined />} valueStyle={{ color: '#cf1322' }} />
                </Card>
              </Col>
            </Row>
          ) : (
            <Alert message="Chưa có dữ liệu" type="info" showIcon />
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Thống kê và báo cáo</Title>
      <Tabs defaultActiveKey="overdue" items={tabItems} onChange={handleTabChange} />
    </div>
  );
}
