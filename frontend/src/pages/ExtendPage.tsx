import { useState } from 'react';
import { Card, Input, Button, Descriptions, Alert, Divider, Typography } from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import { loanApi } from '../services/api';
import axios from 'axios';

const { Title } = Typography;

interface LoanInfo {
  maPhieu: string;
  maDocGia: string;
  maSach: string;
  ngayMuon: string;
  hanTra: string;
  trangThai: string;
}

export default function ExtendPage() {
  const [maPhieu, setMaPhieu] = useState('');

  const [loan, setLoan] = useState<LoanInfo | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [extendedLoan, setExtendedLoan] = useState<LoanInfo | null>(null);
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendError, setExtendError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!maPhieu.trim()) return;
    setSearchError(null);
    setLoan(null);
    setExtendedLoan(null);
    setExtendError(null);
    setSearchLoading(true);
    try {
      const { data } = await loanApi.getById(maPhieu.trim());
      setLoan(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setSearchError(err.response?.data?.error || 'Không tìm thấy phiếu mượn');
      } else {
        setSearchError('Lỗi khi tìm phiếu mượn');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleExtend = async () => {
    if (!loan) return;
    setExtendError(null);
    setExtendedLoan(null);
    setExtendLoading(true);
    try {
      const { data } = await loanApi.extend(loan.maPhieu);
      setExtendedLoan(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setExtendError(err.response?.data?.error || 'Lỗi khi gia hạn');
      } else {
        setExtendError('Lỗi khi gia hạn');
      }
    } finally {
      setExtendLoading(false);
    }
  };

  const trangThaiLabel: Record<string, string> = {
    DANG_MUON: 'Đang mượn',
    DA_TRA: 'Đã trả',
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <Title level={2}>Gia hạn mượn sách</Title>

      {/* Search loan */}
      <Card title="Tìm phiếu mượn" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Input
            placeholder="Nhập mã phiếu mượn"
            value={maPhieu}
            onChange={(e) => setMaPhieu(e.target.value)}
            onPressEnter={handleSearch}
            disabled={!!extendedLoan}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={searchLoading}
            disabled={!maPhieu.trim() || !!extendedLoan}
          >
            Tìm kiếm
          </Button>
        </div>
        {searchError && <Alert message={searchError} type="error" showIcon />}
      </Card>

      {/* Loan info */}
      {loan && !extendedLoan && (
        <>
          <Card title="Thông tin phiếu mượn" style={{ marginBottom: 16 }}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Mã phiếu">{loan.maPhieu}</Descriptions.Item>
              <Descriptions.Item label="Mã độc giả">{loan.maDocGia}</Descriptions.Item>
              <Descriptions.Item label="Mã sách">{loan.maSach}</Descriptions.Item>
              <Descriptions.Item label="Ngày mượn">{loan.ngayMuon}</Descriptions.Item>
              <Descriptions.Item label="Hạn trả">{loan.hanTra}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {trangThaiLabel[loan.trangThai] || loan.trangThai}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Divider />

          <Card>
            {extendError && <Alert message={extendError} type="error" showIcon style={{ marginBottom: 12 }} />}
            {loan.trangThai === 'DA_TRA' ? (
              <Alert message="Phiếu mượn đã hoàn tất, không thể gia hạn" type="warning" showIcon />
            ) : (
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                size="large"
                block
                onClick={handleExtend}
                loading={extendLoading}
              >
                Gia hạn thêm 7 ngày
              </Button>
            )}
          </Card>
        </>
      )}

      {/* Extended result */}
      {extendedLoan && (
        <Card>
          <Alert
            message="Gia hạn thành công!"
            description={
              <Descriptions bordered size="small" column={1} style={{ marginTop: 8 }}>
                <Descriptions.Item label="Mã phiếu">{extendedLoan.maPhieu}</Descriptions.Item>
                <Descriptions.Item label="Hạn trả cũ">{loan?.hanTra}</Descriptions.Item>
                <Descriptions.Item label="Hạn trả mới">{extendedLoan.hanTra}</Descriptions.Item>
              </Descriptions>
            }
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  );
}
