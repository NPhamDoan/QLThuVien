import { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Alert, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { bookApi } from '../services/api';
import axios from 'axios';

const { Title } = Typography;

interface BookRecord {
  maSach: string;
  tieuDe: string;
  tacGia: string;
  tinhTrang: string;
}

const tinhTrangConfig: Record<string, { label: string; color: string }> = {
  SAN_SANG: { label: 'Sẵn sàng', color: 'green' },
  DA_MUON: { label: 'Đã mượn', color: 'orange' },
  BAO_TRI: { label: 'Bảo trì', color: 'blue' },
  MAT: { label: 'Mất', color: 'red' },
};

export default function BooksPage() {
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookRecord | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await bookApi.list();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Lỗi khi tải danh sách sách');
      } else {
        setError('Lỗi khi tải danh sách sách');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const openAddModal = () => {
    setEditingBook(null);
    setModalError(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (book: BookRecord) => {
    setEditingBook(book);
    setModalError(null);
    form.setFieldsValue({
      tieuDe: book.tieuDe,
      tacGia: book.tacGia,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);
      setModalError(null);

      if (editingBook) {
        await bookApi.update(editingBook.maSach, { tieuDe: values.tieuDe, tacGia: values.tacGia });
      } else {
        await bookApi.create({ tieuDe: values.tieuDe, tacGia: values.tacGia });
      }

      setModalOpen(false);
      form.resetFields();
      fetchBooks();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setModalError(err.response?.data?.error || 'Lỗi khi lưu thông tin sách');
      } else if (err instanceof Error && 'errorFields' in err) {
        // form validation error, ignore
      } else {
        setModalError('Lỗi khi lưu thông tin sách');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (maSach: string) => {
    try {
      await bookApi.delete(maSach);
      fetchBooks();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Modal.error({
          title: 'Không thể xóa',
          content: err.response?.data?.error || 'Lỗi khi xóa sách',
        });
      }
    }
  };

  const columns = [
    { title: 'Mã sách', dataIndex: 'maSach', key: 'maSach' },
    { title: 'Tiêu đề', dataIndex: 'tieuDe', key: 'tieuDe' },
    { title: 'Tác giả', dataIndex: 'tacGia', key: 'tacGia' },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      key: 'tinhTrang',
      render: (val: string) => {
        const cfg = tinhTrangConfig[val];
        return cfg ? <Tag color={cfg.color}>{cfg.label}</Tag> : <Tag>{val}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: unknown, record: BookRecord) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa sách này?"
            onConfirm={() => handleDelete(record.maSach)}
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
        <Title level={2} style={{ margin: 0 }}>Quản lý sách</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm sách
        </Button>
      </div>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <Table
        columns={columns}
        dataSource={books}
        rowKey="maSach"
        loading={loading}
        locale={{ emptyText: 'Chưa có sách nào' }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingBook ? 'Sửa thông tin sách' : 'Thêm sách mới'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        confirmLoading={modalLoading}
        okText={editingBook ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        {modalError && <Alert message={modalError} type="error" showIcon style={{ marginBottom: 12 }} />}
        <Form form={form} layout="vertical">
          <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề sách' }]}>
            <Input placeholder="Nhập tiêu đề sách" />
          </Form.Item>
          <Form.Item name="tacGia" label="Tác giả" rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}>
            <Input placeholder="Nhập tên tác giả" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
