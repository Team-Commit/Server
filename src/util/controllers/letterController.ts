import {
  Router, Request, Response, NextFunction,
} from 'express';
import { validateOrReject } from 'class-validator';
import LetterService from '../services/letterService';
import CreateLetterDto from '../../types/requestTypes/createLetter.dto';

const router = Router();
const letterService = LetterService.getInstance();

// 편지 생성하기
router.post(
  '/letters',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createLetterDto = new CreateLetterDto(req.body);

      await validateOrReject(createLetterDto);

      await letterService.createLetter(req.userUUID, createLetterDto);

      res.json({ data: true });
    } catch (error) {
      next(error);
    }
  },
);

// 편지 읽기
router.get(
  '/letters/:letterUUID',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { letterUUID } = req.params;

      if (!letterUUID) {
        throw new Error('Invalid query');
      }

      await letterService.readLetter(req.userUUID, letterUUID);

      res.json({ data: true });
    } catch (error) {
      next(error);
    }
  },
);

// 편지 공감하기
router.post(
  '/letters/:letterUUID/like',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { letterUUID } = req.params;

      if (!letterUUID) {
        throw new Error('Invalid query');
      }

      await letterService.likeLetter(req.userUUID, letterUUID);

      res.json({ data: true });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
