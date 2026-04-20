import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Alert, Popconfirm, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { readerApi } from '../services/api';
import axios from 'axios';
import dayjs from 'dayjs';

interface ReaderRecord {
  maDocGia: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngayHetHan: string;
}

export default function ReadersPage() {
  const [allReaders, setAllReaders] = useState<ReaderRecord[]>([]);
  const [displayReaders, setDisplayReaders] = useState<ReaderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search
  const [keyword, setKeyword] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReader, setEditingReader] = useState<ReaderRecord | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchReaders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await readerApi.list();
      const readers = Array.isArray(data) ? data : [];
      setAllReaders(readers);
      if (!isSearching) setDisplayReaders(readers);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Lỗi khi tải danh sách độc giả');
      } else {
        setError('Lỗi khi tải danh sách độc giả');
      }
    } finally {
      setLoading(false);
    }
  }, [isSearching]);

  useEffect(() => { fetchReaders(); }, [fetchReaders]);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setIsSearching(false);
      setDisplayReaders(allReaders);
      return;
    }
    setSearchLoading(true);
    setIsSearching(true);
    try {
      const { data } = await readerApi.search(keyword.trim());
      setDisplayReaders(Array.isArray(data) ? data : []);
    } catch {
      setDisplayReaders([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setKeyword('');
    setIsSearching(false);
    setDisplayReaders(allReaders);
  };

  const openAddModal = () => {
    setEditingReader(null);
    setModalError(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (reader: ReaderRecord) => {
    setEditingReader(reader);
    setModalError(null);
    form.setFieldsValue({
      hoTen: reader.hoTen,
      email: reader.email,
      soDienThoai: reader.soDienThoai,
      ngayHetHan: reader.ngayHetHan ? dayjs(reader.ngayHetHan) : null,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);
      setModalError(null);

      const payload = {
        hoTen: values.hoTen,
        email: values.email,
        soDienThoai: values.soDienThoai,
        ngayHetHan: values.ngayHetHan ? values.ngayHetHan.format('YYYY-MM-DD') : undefined,
      };

      if (editingReader) {
        await readerApi.update(editingReader.maDocGia, payload);
      } else {
        await readerApi.create(payload);
      }

      setModalOpen(false);
      form.resetFields();
      setIsSearching(false);
      setKeyword('');
      fetchReaders();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setModalError(err.response?.data?.error || 'Lỗi khi lưu thông tin độc giả');
      } else if (err instanceof Error && 'errorFields' in err) {
        // form validation error, ignore
      } else {
        setModalError('Lỗi khi lưu thông tin độc giả');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (maDocGia: string) => {
    try {
      await readerApi.delete(maDocGia);
      fetchReaders();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Modal.error({
          title: 'Không thể xóa',
          content: err.response?.data?.error || 'Lỗi khi xóa độc giả',
        });
      }
    }
  };

  const columns = [
    { title: 'Mã độc giả', dataIndex: 'maDocGia', key: 'maDocGia' },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'soDienThoai', key: 'soDienThoai' },
    { title: 'Ngày hết hạn', dataIndex: 'ngayHetHan', key: 'ngayHetHan' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: unknown, record: ReaderRecord) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa độc giả này?"
            onConfirm={() => handleDelete(record.maDocGia)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header: Search + Add */}
      <Row gutter={16} align="middle" style={{ marginBottom: 20 }}>
        <Col flex="auto">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
              placeholder="Tìm theo mã, tên, email hoặc SĐT..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              onClear={handleClearSearch}
              style={{ maxWidth: 400 }}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={searchLoading}>
              Tìm
            </Button>
          </Space.Compact>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>Thêm độc giả</Button>
        </Col>
      </Row>

      {isSearching && (
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color="blue">Kết quả tìm kiếm: {displayReaders.length} độc giả</Tag>
          <Button type="link" size="small" onClick={handleClearSearch}>Xóa bộ lọc</Button>
        </div>
      )}

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <Table
        columns={columns}
        dataSource={displayReaders}
        rowKey="maDocGia"
        loading={loading || searchLoading}
        locale={{ emptyText: isSearching ? 'Không tìm thấy độc giả phù hợp' : 'Chưa có độc giả nào' }}
        pagination={{ pageSize: 10 }}
        size="small"
      />

      <Modal
        title={editingReader ? 'Sửa thông tin độc giả' : 'Thêm độc giả mới'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        confirmLoading={modalLoading}
        okText={editingReader ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        {modalError && <Alert message={modalError} type="error" showIcon style={{ marginBottom: 12 }} />}
        <Form form={form} layout="vertical">
          <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item name="soDienThoai" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item name="ngayHetHan" label="Ngày hết hạn thẻ" rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày hết hạn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
