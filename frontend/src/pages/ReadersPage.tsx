import { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, DatePicker, Alert, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { readerApi } from '../services/api';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;

interface ReaderRecord {
  maDocGia: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngayHetHan: string;
}

export default function ReadersPage() {
  const [readers, setReaders] = useState<ReaderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setReaders(Array.isArray(data) ? data : []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Lỗi khi tải danh sách độc giả');
      } else {
        setError('Lỗi khi tải danh sách độc giả');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReaders(); }, [fetchReaders]);

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
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý độc giả</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm độc giả
        </Button>
      </div>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <Table
        columns={columns}
        dataSource={readers}
        rowKey="maDocGia"
        loading={loading}
        locale={{ emptyText: 'Chưa có độc giả nào' }}
        pagination={{ pageSize: 10 }}
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
