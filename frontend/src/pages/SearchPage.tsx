import { useState } from 'react';
import { Typography, Input, Select, Button, Table, Tag, Alert, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { bookApi } from '../services/api';
import axios from 'axios';

const { Title } = Typography;

type SearchType = 'tieuDe' | 'tacGia' | 'maSach';

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

export default function SearchPage() {
  const [searchType, setSearchType] = useState<SearchType>('tieuDe');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<BookRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setError(null);
    setLoading(true);
    setSearched(true);
    try {
      const params: Record<string, string> = { [searchType]: keyword.trim() };
      const { data } = await bookApi.search(params);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Lỗi khi tìm kiếm sách');
      } else {
        setError('Lỗi khi tìm kiếm sách');
      }
      setResults([]);
    } finally {
      setLoading(false);
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
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Tra cứu sách</Title>

      <Space.Compact style={{ width: '100%', maxWidth: 600, marginBottom: 16 }}>
        <Select
          value={searchType}
          onChange={(val) => setSearchType(val)}
          style={{ width: 160 }}
          options={[
            { value: 'tieuDe', label: 'Tiêu đề' },
            { value: 'tacGia', label: 'Tác giả' },
            { value: 'maSach', label: 'Mã sách' },
          ]}
        />
        <Input
          placeholder="Nhập từ khóa tìm kiếm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
          disabled={!keyword.trim()}
        >
          Tìm kiếm
        </Button>
      </Space.Compact>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      {searched && !error && results.length === 0 && !loading && (
        <Alert message="Không tìm thấy sách phù hợp" type="info" showIcon style={{ marginBottom: 16 }} />
      )}

      <Table
        columns={columns}
        dataSource={results}
        rowKey="maSach"
        loading={loading}
        locale={{ emptyText: searched ? 'Không tìm thấy sách phù hợp' : 'Nhập từ khóa để tìm kiếm' }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
