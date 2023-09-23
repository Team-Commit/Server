import {
  Router, Request, Response, NextFunction,
} from 'express';
import { validateOrReject } from 'class-validator';
import LetterService from '../services/letterService';
import CreateLetterDto from '../../types/requestTypes/createLetter.dto';
import { BadRequestError } from '../middelwares/error/error';
import ErrorCode from '../../types/ErrorTypes/errorCode';
import checkAccessToken from '../middelwares/checkAccessToken';
import GetLetterDto from '../../types/responseTypes/getLetter.dto';

const router = Router();
const letterService = LetterService.getInstance();

// 편지 생성하기
router.post(
  '/letters',
  checkAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createLetterDto = new CreateLetterDto(req.body);

      await validateOrReject(createLetterDto);

      await letterService.createLetter(
        req.userUUID,
        createLetterDto.toServiceModel(),
      );

      res.json({ data: true });
    } catch (error) {
      next(error);
    }
  },
);

// 랜덤 편지 읽기
router.get(
  '/letters/random',
  checkAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const letter = await letterService.readRandomLetter(req.userUUID);

      const letterData = new GetLetterDto(letter);

      res.json({ data: letterData });
    } catch (error) {
      next(error);
    }
  },
);

// 특정 편지 읽기
router.get(
  '/letters/:letterUUID',
  checkAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { letterUUID } = req.params;

      if (!letterUUID) {
        throw new BadRequestError(ErrorCode.INVALID_QUERY, {
          message: 'Invalid query',
        });
      }

      const letter = await letterService.readLetter(req.userUUID, letterUUID);

      const letterData = new GetLetterDto(letter);

      res.json({ data: letterData });
    } catch (error) {
      next(error);
    }
  },
);

// 편지 공감하기
router.post(
  '/letters/:letterUUID/like',
  checkAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { letterUUID } = req.params;

      if (!letterUUID) {
        throw new BadRequestError(ErrorCode.INVALID_QUERY, {
          message: 'Invalid query',
        });
      }

      await letterService.likeLetter(req.userUUID, letterUUID);

      res.json({ data: true });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
