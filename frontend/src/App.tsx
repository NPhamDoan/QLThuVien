import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import BorrowPage from './pages/BorrowPage';
import ReturnPage from './pages/ReturnPage';
import ExtendPage from './pages/ExtendPage';
import SearchPage from './pages/SearchPage';
import ReadersPage from './pages/ReadersPage';
import BooksPage from './pages/BooksPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0d6efd',
          colorSuccess: '#198754',
          colorWarning: '#ffc107',
          colorError: '#dc3545',
          colorInfo: '#0dcaf0',
          borderRadius: 6,
          fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: 14,
          colorBgContainer: '#ffffff',
          colorBgLayout: '#e9ecef',
          colorBorder: '#dee2e6',
          colorBorderSecondary: '#ced4da',
        },
        components: {
          Button: {
            controlHeight: 38,
            fontWeight: 500,
          },
          Card: {
            borderRadiusLG: 8,
          },
          Table: {
            headerBg: '#f8f9fa',
            headerColor: '#212529',
            borderColor: '#dee2e6',
          },
          Input: {
            controlHeight: 38,
          },
          Menu: {
            darkItemBg: '#212529',
            darkSubMenuItemBg: '#212529',
            darkItemSelectedBg: '#0d6efd',
          },
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/borrow" replace />} />
                <Route path="/borrow" element={<BorrowPage />} />
                <Route path="/return" element={<ReturnPage />} />
                <Route path="/extend" element={<ExtendPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/readers" element={<ReadersPage />} />
                <Route path="/books" element={<BooksPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="QUAN_TRI_VIEN" />}>
              <Route element={<MainLayout />}>
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}
