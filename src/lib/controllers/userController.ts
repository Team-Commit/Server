import {
  Router, Request, Response, NextFunction,
} from 'express';
import { validateOrReject } from 'class-validator';
import UserService from '../services/userService';
import checkAccessToken from '../middelwares/checkAccessToken';
import UpdateUserDto from '../../types/requestTypes/updateUser.dto';
import GetUserDto from '../../types/responseTypes/getUser.dto';

const router = Router();
const userService = UserService.getInstance();

// 유저 정보 수정하기
router.patch(
  '/users/me',
  checkAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateUserDto = new UpdateUserDto(req.body);

      await validateOrReject(updateUserDto);

      const user = await userService.updateUser(
        req.userUUID,
        updateUserDto.toServiceModel(),
      );

      const userData = new GetUserDto(user);

      res.json({ data: userData });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
