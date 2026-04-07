import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Avatar, Space, Tag } from 'antd';
import {
  BookOutlined,
  ImportOutlined,
  ExportOutlined,
  HistoryOutlined,
  SearchOutlined,
  TeamOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/borrow', icon: <ImportOutlined />, label: 'Mượn sách' },
    { key: '/return', icon: <ExportOutlined />, label: 'Trả sách' },
    { key: '/extend', icon: <HistoryOutlined />, label: 'Gia hạn' },
    { type: 'divider' as const },
    { key: '/search', icon: <SearchOutlined />, label: 'Tra cứu sách' },
    { key: '/books', icon: <BookOutlined />, label: 'Quản lý sách' },
    { key: '/readers', icon: <TeamOutlined />, label: 'Quản lý độc giả' },
    ...(user?.vaiTro === 'QUAN_TRI_VIEN'
      ? [{ type: 'divider' as const }, { key: '/reports', icon: <BarChartOutlined />, label: 'Thống kê' }]
      : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{
          background: 'linear-gradient(180deg, #343a40 0%, #212529 100%)',
          borderRight: '1px solid #495057',
          boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
        }}
        width={240}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #495057',
          background: 'linear-gradient(180deg, #495057 0%, #343a40 100%)',
        }}>
          <Typography.Text strong style={{
            color: '#fff',
            fontSize: collapsed ? 18 : 17,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}>
            {collapsed ? '📚' : '📚 Thư viện'}
          </Typography.Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 0, marginTop: 4 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #dee2e6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
          height: 64,
          zIndex: 1,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <Space size="middle">
            <Space size="small">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{
                  backgroundColor: user?.vaiTro === 'QUAN_TRI_VIEN' ? '#0d6efd' : '#198754',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
              <Typography.Text strong style={{ color: '#212529' }}>{user?.tenDangNhap}</Typography.Text>
              <Tag
                color={user?.vaiTro === 'QUAN_TRI_VIEN' ? 'blue' : 'green'}
                style={{ margin: 0 }}
              >
                {user?.vaiTro === 'QUAN_TRI_VIEN' ? 'Quản trị viên' : 'Thủ thư'}
              </Tag>
            </Space>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              danger
              size="small"
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: 20 }}>
          <div style={{
            padding: 24,
            background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 8,
            minHeight: 360,
            border: '1px solid #dee2e6',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
