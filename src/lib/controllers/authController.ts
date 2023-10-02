import {
  Router, Request, Response, NextFunction,
} from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
import SignInDto from '../../types/requestTypes/signIn.dto';
import LoginUserDto from '../../types/responseTypes/loginUser.dto';
import RefreshTokenDto from '../../types/requestTypes/refreshToken.dto';
import { RefreshTokenForm } from '../../types/types';
import checkAccessToken from '../middelwares/checkAccessToken';

const router = Router();

const authService = AuthService.getInstance();

// 회원가압
router.post(
  '/auth/sign-in',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signInDto = new SignInDto(req.body);

      await validateOrReject(signInDto);

      const user = await authService.signIn(signInDto);

      const userData = new LoginUserDto(user);

      res.json({ data: userData });
    } catch (error) {
      next(error);
    }
  },
);

// 회원가압
router.post(
  '/auth/refresh',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshTokenDto = new RefreshTokenDto(req.body);

      await validateOrReject(refreshTokenDto);

      const accessToken = await authService.refreshToken(refreshTokenDto);

      res.json({ data: accessToken });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
