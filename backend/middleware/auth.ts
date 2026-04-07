import { Request, Response, NextFunction } from 'express';
import { VaiTro, TrangThaiTaiKhoan } from '../types';

export interface SessionInfo {
  maTaiKhoan: string;
  tenDangNhap: string;
  vaiTro: VaiTro;
  trangThai: TrangThaiTaiKhoan;
}

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: SessionInfo;
    }
  }
}

// In-memory session store: maTaiKhoan -> SessionInfo
export const sessionStore = new Map<string, SessionInfo>();

export function addSession(session: SessionInfo): void {
  sessionStore.set(session.maTaiKhoan, session);
}

export function removeSession(maTaiKhoan: string): void {
  sessionStore.delete(maTaiKhoan);
}

/**
 * Middleware xác thực: kiểm tra Authorization header (Bearer <maTaiKhoan>)
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Không có token xác thực' });
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer "

  const session = sessionStore.get(token);
  if (!session) {
    res.status(401).json({ error: 'Token không hợp lệ hoặc phiên đã hết hạn' });
    return;
  }

  req.user = session;
  next();
}

/**
 * Middleware phân quyền: kiểm tra vai trò người dùng
 */
export function requireRole(role: VaiTro) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.vaiTro !== role) {
      res.status(403).json({ error: 'Không có quyền truy cập' });
      return;
    }
    next();
  };
}
