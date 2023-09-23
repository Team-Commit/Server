import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import SignInDto from '../../types/requestTypes/signIn.dto';
import { UserDAO, UserModel } from '../../database/models/user';
import UserService from './userService';
import ModelConverter from '../../converter/modelConverter';
import { LoginUserForm } from '../../types/types';
import { adjectives, nouns } from '../../util/random-word';

class AuthService {
  private static instance: AuthService;

  userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  /**
	 * 로그인
	 * @param signInDto
	 */
  async signIn(signInDto: SignInDto): Promise<LoginUserForm> {
    const { deviceId } = signInDto;

    let user: UserDAO | null;

    user = await UserModel.findOne({ deviceId: deviceId });

    if (!user) {
      const uuid = v4();

      const randomNickname = this.createRandomNickname();

      user = await new UserModel({
        uuid: uuid,
        deviceId: deviceId,
        nickname: randomNickname,
        point: 3,
        send: 0,
        receive: 0,
        sound: true,
        alarm: true,
      }).save();
    }

    const accessToken = this.createTokens(user.uuid);

    const userData = ModelConverter.toUser(user);

    return { accessToken: accessToken, ...userData };
  }

  /**
	 * userUUID로 accessToken 생성
	 * @param userUUID
	 */
  createTokens(userUUID: string): string {
    return jwt.sign({ userUUID: userUUID }, 'any');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  createRandomNickname(): string {
    const getRandomElement = (array: string[]) => array[Math.floor(Math.random() * array.length)];

    const randomAdjective = getRandomElement(adjectives);
    const randomNoun = getRandomElement(nouns);

    return `${randomAdjective} ${randomNoun}`;
  }
}

export default AuthService;
