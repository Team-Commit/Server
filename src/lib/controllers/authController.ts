import {
  Router, Request, Response, NextFunction,
} from 'express';
import { validateOrReject } from 'class-validator';
import AuthService from '../services/authService';
import SignInDto from '../../types/requestTypes/signIn.dto';
import LoginUserDto from '../../types/responseTypes/loginUser.dto';

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

export default router;
