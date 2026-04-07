import { useState } from 'react';
import { Card, Input, Button, Descriptions, Alert, Divider, Typography } from 'antd';
import { SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { readerApi, bookApi, loanApi } from '../services/api';
import axios from 'axios';

const { Title } = Typography;

interface ReaderInfo {
  maDocGia: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngayHetHan: string;
}

interface BookInfo {
  maSach: string;
  tieuDe: string;
  tacGia: string;
  tinhTrang: string;
}

interface LoanResult {
  maPhieu: string;
  ngayMuon: string;
  hanTra: string;
}

export default function BorrowPage() {
  const [maDocGia, setMaDocGia] = useState('');
  const [maSach, setMaSach] = useState('');

  const [reader, setReader] = useState<ReaderInfo | null>(null);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);

  const [book, setBook] = useState<BookInfo | null>(null);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const [loanResult, setLoanResult] = useState<LoanResult | null>(null);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowError, setBorrowError] = useState<string | null>(null);

  const handleValidateReader = async () => {
    if (!maDocGia.trim()) return;
    setReaderError(null);
    setReader(null);
    setReaderLoading(true);
    try {
      const { data } = await readerApi.getById(maDocGia.trim());
      setReader(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setReaderError(err.response?.data?.error || 'Không tìm thấy độc giả');
      } else {
        setReaderError('Lỗi khi kiểm tra độc giả');
      }
    } finally {
      setReaderLoading(false);
    }
  };

  const handleValidateBook = async () => {
    if (!maSach.trim()) return;
    setBookError(null);
    setBook(null);
    setBookLoading(true);
    try {
      const { data } = await bookApi.search({ maSach: maSach.trim() });
      if (data.length === 0) {
        setBookError('Mã sách không tồn tại');
      } else {
        setBook(data[0]);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setBookError(err.response?.data?.error || 'Lỗi khi kiểm tra sách');
      } else {
        setBookError('Lỗi khi kiểm tra sách');
      }
    } finally {
      setBookLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!reader || !book) return;
    setBorrowError(null);
    setLoanResult(null);
    setBorrowLoading(true);
    try {
      const { data } = await loanApi.create(reader.maDocGia, book.maSach);
      setLoanResult({
        maPhieu: data.maPhieu,
        ngayMuon: data.ngayMuon,
        hanTra: data.hanTra,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setBorrowError(err.response?.data?.error || 'Lỗi khi tạo phiếu mượn');
      } else {
        setBorrowError('Lỗi khi tạo phiếu mượn');
      }
    } finally {
      setBorrowLoading(false);
    }
  };

  const tinhTrangLabel: Record<string, string> = {
    SAN_SANG: 'Sẵn sàng',
    DA_MUON: 'Đã mượn',
    BAO_TRI: 'Bảo trì',
    MAT: 'Mất',
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <Title level={2}>Mượn sách</Title>

      {/* Step 1: Validate reader */}
      <Card title="Bước 1: Kiểm tra độc giả" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Input
            placeholder="Nhập mã độc giả"
            value={maDocGia}
            onChange={(e) => setMaDocGia(e.target.value)}
            onPressEnter={handleValidateReader}
            disabled={!!loanResult}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleValidateReader}
            loading={readerLoading}
            disabled={!maDocGia.trim() || !!loanResult}
          >
            Kiểm tra
          </Button>
        </div>
        {readerError && <Alert message={readerError} type="error" showIcon style={{ marginBottom: 8 }} />}
        {reader && (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Mã độc giả">{reader.maDocGia}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{reader.hoTen}</Descriptions.Item>
            <Descriptions.Item label="Email">{reader.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{reader.soDienThoai}</Descriptions.Item>
            <Descriptions.Item label="Ngày hết hạn thẻ">{reader.ngayHetHan}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Divider />

      {/* Step 2: Validate book */}
      <Card title="Bước 2: Kiểm tra sách" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Input
            placeholder="Nhập mã sách"
            value={maSach}
            onChange={(e) => setMaSach(e.target.value)}
            onPressEnter={handleValidateBook}
            disabled={!!loanResult}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleValidateBook}
            loading={bookLoading}
            disabled={!maSach.trim() || !!loanResult}
          >
            Kiểm tra
          </Button>
        </div>
        {bookError && <Alert message={bookError} type="error" showIcon style={{ marginBottom: 8 }} />}
        {book && (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Mã sách">{book.maSach}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{book.tieuDe}</Descriptions.Item>
            <Descriptions.Item label="Tác giả">{book.tacGia}</Descriptions.Item>
            <Descriptions.Item label="Tình trạng">{tinhTrangLabel[book.tinhTrang] || book.tinhTrang}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Divider />

      {/* Step 3: Confirm borrow */}
      <Card title="Bước 3: Xác nhận mượn sách">
        {borrowError && <Alert message={borrowError} type="error" showIcon style={{ marginBottom: 12 }} />}
        {!loanResult ? (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            size="large"
            block
            onClick={handleBorrow}
            loading={borrowLoading}
            disabled={!reader || !book}
          >
            Xác nhận mượn sách
          </Button>
        ) : (
          <Alert
            message="Mượn sách thành công!"
            description={
              <Descriptions bordered size="small" column={1} style={{ marginTop: 8 }}>
                <Descriptions.Item label="Mã phiếu">{loanResult.maPhieu}</Descriptions.Item>
                <Descriptions.Item label="Ngày mượn">{loanResult.ngayMuon}</Descriptions.Item>
                <Descriptions.Item label="Hạn trả">{loanResult.hanTra}</Descriptions.Item>
              </Descriptions>
            }
            type="success"
            showIcon
          />
        )}
      </Card>
    </div>
  );
}
