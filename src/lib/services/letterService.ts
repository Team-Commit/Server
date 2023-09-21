import { v4 } from 'uuid';
import { CreateLetterForm, Letter } from '../../types/types';
import { LetterModel } from '../../database/models/letter';
import { UserModel } from '../../database/models/user';
import { HistoryModel } from '../../database/models/history';
import ErrorCode from '../../types/ErrorTypes/errorCode';
import {
  InternalServerError,
  BadRequestError,
} from '../middelwares/error/error';
import ModelConverter from '../../converter/modelConverter';

class LetterService {
  private static instance: LetterService;

  private constructor() {}

  checkSlang(content: string): boolean {
    const pattern =			/[시씨슈쓔쉬쉽쒸쓉]([0-9]*|[0-9]+ *)[바발벌빠빡빨뻘파팔펄]|[섊좆좇졷좄좃좉졽썅춍]|ㅅㅣㅂㅏㄹ?|ㅂ[0-9]*ㅅ|[ㅄᄲᇪᄺᄡᄣᄦᇠ]|[ㅅㅆᄴ][0-9]*[ㄲㅅㅆᄴㅂ]|[존좉좇][0-9 ]*나|[자보][0-9]+지|보빨|[봊봋봇봈볻봁봍] *[빨이]|[후훚훐훛훋훗훘훟훝훑][장앙]|후빨|[엠앰]창|애[미비]|애자|[^탐]색기|([샊샛세쉐쉑쉨쉒객갞갟갯갰갴겍겎겏겤곅곆곇곗곘곜걕걖걗걧걨걬] *[끼키퀴])|새 *[키퀴]|[병븅]신|미친[가-닣닥-힣]|[믿밑]힌|[염옘]병|[샊샛샜샠섹섺셋셌셐셱솃솄솈섁섂섓섔섘]기|[섹섺섻쎅쎆쎇쎽쎾쎿섁섂섃썍썎썏][스쓰]|지랄|니[애에]미|갈[0-9]*보[^가-힣]|[뻐뻑뻒뻙뻨][0-9]*[뀨큐킹낑)|꼬추|곧휴|[가-힣]슬아치|자박꼼|[병븅]딱|빨통|[사싸](이코|가지|까시)|육시[랄럴]|육실[알얼할헐]|즐[^가-힣]|찌(질이|랭이)|찐따|찐찌버거|창[녀놈]|[가-힣]{2,}충[^가-힣]|[가-힣]{2,}츙|부녀자|화냥년|환[양향]년|호[구모]|조[선센][징]|조센|[쪼쪽쪾]([발빨]이|[바빠]리)|盧|무현|찌끄[레래]기|(하악){2,}|하[앍앜]|[낭당랑앙항남담람암함][ ]?[가-힣]+[띠찌]|느[금급]마|文在|在寅|(?<=[^\n])[家哥]|속냐|[tT]l[qQ]kf|Wls/;

    return pattern.test(content);
  }

  async createLetter(
    userUUID: string,
    createLetterForm: CreateLetterForm,
  ): Promise<void> {
    const { content } = createLetterForm;

    const user = await UserModel.findOne({ uuid: userUUID });

    // 잘못된 유저 인지 체크 -> 근데 이거 다른데서 할 수 있을 것 같음
    if (!user) {
      throw new InternalServerError(ErrorCode.USER_NOT_FOUND, {
        message: 'User not found',
      });
    }

    // 비속어 체크
    if (this.checkSlang(content)) {
      throw new BadRequestError(ErrorCode.LETTER_INCLUDE_SLANG, {
        message: 'Slang word includes in letter',
      });
    }

    const uuid = v4();

    user.point += 1;

    await Promise.all([
      new LetterModel({
        uuid: uuid,
        user: userUUID,
        content: content,
        like: 0,
        read: 0,
      }).save(),
      user.save(),
    ]);
  }

  async readLetter(userUUID: string, letterUUID: string): Promise<Letter> {
    const letter = await LetterModel.findOne({ uuid: letterUUID });

    if (!letter) {
      throw new InternalServerError(ErrorCode.LETTER_NOT_FOUND, {
        message: 'Letter not found',
      });
    }

    // 유저 읽기 개수 1개 차감 및 읽기 history에 저장
    const user = await UserModel.findOne({ uuid: userUUID });

    if (!user) {
      throw new InternalServerError(ErrorCode.USER_NOT_FOUND, {
        message: 'User not found',
      });
    }

    if (user.point < 1) {
      throw new BadRequestError(ErrorCode.LETTER_POINT_NOT_ENOUGH, {
        message: 'Point not enough',
      });
    }

    user.point -= 1;

    await Promise.all([
      user.save(),
      new HistoryModel({ user: user, letter: letter }),
    ]);

    return ModelConverter.toLetter(letter);
  }

  async likeLetter(userUUID: string, letterUUID: string): Promise<void> {
    const user = await UserModel.findOne({ uuid: userUUID });

    if (!user) {
      throw new InternalServerError(ErrorCode.USER_NOT_FOUND, {
        message: 'User not found',
      });
    }

    const letter = await LetterModel.findOne({ uuid: letterUUID });

    if (!letter) {
      throw new InternalServerError(ErrorCode.LETTER_NOT_FOUND, {
        message: 'Letter not found',
      });
    }

    // 유저 읽기 개수 1개 차감 및 읽기 history에 저장
    letter.like += 1;

    await letter.save();
  }

  public static getInstance(): LetterService {
    if (!LetterService.instance) {
      LetterService.instance = new LetterService();
    }
    return LetterService.instance;
  }
}

export default LetterService;
