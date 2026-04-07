import { useState } from 'react';
import { Card, Input, Button, Descriptions, Alert, Divider, Typography, Statistic } from 'antd';
import { SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
  tienPhat: number;
}

interface ReturnResult {
  success: boolean;
  tienPhat: number;
  ngayTraThucTe: string;
}

export default function ReturnPage() {
  const [maPhieu, setMaPhieu] = useState('');

  const [loan, setLoan] = useState<LoanInfo | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [returnResult, setReturnResult] = useState<ReturnResult | null>(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!maPhieu.trim()) return;
    setSearchError(null);
    setLoan(null);
    setReturnResult(null);
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

  const handleReturn = async () => {
    if (!loan) return;
    setReturnError(null);
    setReturnResult(null);
    setReturnLoading(true);
    try {
      const { data } = await loanApi.returnBook(loan.maPhieu);
      setReturnResult({
        success: data.success,
        tienPhat: data.tienPhat,
        ngayTraThucTe: data.ngayTraThucTe,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setReturnError(err.response?.data?.error || err.response?.data?.message || 'Lỗi khi trả sách');
      } else {
        setReturnError('Lỗi khi trả sách');
      }
    } finally {
      setReturnLoading(false);
    }
  };

  const isOverdue = () => {
    if (!loan) return false;
    const today = new Date();
    const hanTra = new Date(loan.hanTra);
    return today > hanTra && loan.trangThai === 'DANG_MUON';
  };

  const estimateFine = () => {
    if (!loan || !isOverdue()) return 0;
    const today = new Date();
    const hanTra = new Date(loan.hanTra);
    const diffDays = Math.ceil((today.getTime() - hanTra.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays * 5000;
  };

  const trangThaiLabel: Record<string, string> = {
    DANG_MUON: 'Đang mượn',
    DA_TRA: 'Đã trả',
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <Title level={2}>Trả sách</Title>

      {/* Search loan */}
      <Card title="Tìm phiếu mượn" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Input
            placeholder="Nhập mã phiếu mượn"
            value={maPhieu}
            onChange={(e) => setMaPhieu(e.target.value)}
            onPressEnter={handleSearch}
            disabled={!!returnResult}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={searchLoading}
            disabled={!maPhieu.trim() || !!returnResult}
          >
            Tìm kiếm
          </Button>
        </div>
        {searchError && <Alert message={searchError} type="error" showIcon />}
      </Card>

      {/* Loan info */}
      {loan && !returnResult && (
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

            {isOverdue() && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  message="Sách quá hạn!"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 12 }}
                />
                <Statistic
                  title="Tiền phạt ước tính"
                  value={estimateFine()}
                  suffix="VND"
                  valueStyle={{ color: '#cf1322' }}
                />
              </div>
            )}
          </Card>

          <Divider />

          <Card>
            {returnError && <Alert message={returnError} type="error" showIcon style={{ marginBottom: 12 }} />}
            {loan.trangThai === 'DA_TRA' ? (
              <Alert message="Sách đã được trả trước đó" type="info" showIcon />
            ) : (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                block
                onClick={handleReturn}
                loading={returnLoading}
              >
                Xác nhận trả sách
              </Button>
            )}
          </Card>
        </>
      )}

      {/* Return result */}
      {returnResult && (
        <Card>
          <Alert
            message="Trả sách thành công!"
            description={
              <Descriptions bordered size="small" column={1} style={{ marginTop: 8 }}>
                <Descriptions.Item label="Ngày trả thực tế">
                  {new Date(returnResult.ngayTraThucTe).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
                <Descriptions.Item label="Tiền phạt">
                  {returnResult.tienPhat > 0 ? (
                    <Statistic
                      value={returnResult.tienPhat}
                      suffix="VND"
                      valueStyle={{ color: '#cf1322', fontSize: 16 }}
                    />
                  ) : (
                    'Không có'
                  )}
                </Descriptions.Item>
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
