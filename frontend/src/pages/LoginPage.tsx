import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const { Title, Text } = Typography;

interface LoginForm {
  tenDangNhap: string;
  matKhau: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: 'Tên đăng nhập không tồn tại',
  WRONG_PASSWORD: 'Mật khẩu không đúng',
  ACCOUNT_LOCKED: 'Tài khoản đã bị khóa',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: LoginForm) => {
    setError(null);
    setLoading(true);
    try {
      await login(values.tenDangNhap, values.matKhau);
      navigate('/', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.error;
        setError(ERROR_MESSAGES[code] || 'Đăng nhập thất bại');
      } else if (err instanceof Error) {
        const msg = err.message;
        setError(ERROR_MESSAGES[msg] || msg || 'Đăng nhập thất bại');
      } else {
        setError('Đăng nhập thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #495057 0%, #212529 100%)',
      }}
    >
      <Card style={{
        width: 420,
        borderRadius: 8,
        border: '1px solid #dee2e6',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>📚</div>
          <Title level={3} style={{ margin: 0, color: '#212529' }}>
            Quản lý Thư viện
          </Title>
          <Text type="secondary">Đăng nhập để tiếp tục</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form<LoginForm> onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item
            name="tenDangNhap"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" size="large" />
          </Form.Item>

          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
