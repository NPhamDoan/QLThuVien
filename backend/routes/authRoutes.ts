import { Router, Request, Response } from 'express';
import { TaiKhoanController } from '../controllers/TaiKhoanController';
import { addSession, removeSession } from '../middleware/auth';
import { TrangThaiTaiKhoan } from '../types';

export function createAuthRoutes(controller: TaiKhoanController): Router {
  const router = Router();

  // POST /auth/login
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { tenDangNhap, matKhau } = req.body;
      if (!tenDangNhap || !matKhau) {
        res.status(400).json({ error: 'tenDangNhap và matKhau là bắt buộc' });
        return;
      }
      const result = await controller.dangNhap(tenDangNhap, matKhau);
      if (result.success && result.taiKhoan) {
        addSession({
          maTaiKhoan: result.taiKhoan.maTaiKhoan,
          tenDangNhap: result.taiKhoan.tenDangNhap,
          vaiTro: result.taiKhoan.vaiTro,
          trangThai: result.taiKhoan.trangThai as TrangThaiTaiKhoan,
        });
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: 'Lỗi hệ thống' });
    }
  });

  // POST /auth/logout
  router.post('/logout', async (req: Request, res: Response) => {
    try {
      const { maTaiKhoan } = req.body;
      if (!maTaiKhoan) {
        res.status(400).json({ error: 'maTaiKhoan là bắt buộc' });
        return;
      }
      removeSession(maTaiKhoan);
      await controller.dangXuat(maTaiKhoan);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi hệ thống' });
    }
  });

  return router;
}
