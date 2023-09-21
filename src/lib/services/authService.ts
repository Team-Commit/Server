import jwt from 'jsonwebtoken';
import SignInDto from '../../types/requestTypes/signIn.dto';
import { UserModel } from '../../database/models/user';
import UserService from './userService';

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
  async signIn(signInDto: SignInDto): Promise<string> {
    const { deviceId } = signInDto;

    const user = await UserModel.findOne({ deviceId: deviceId });

    let userUUID;
    if (!user) {
      userUUID = await this.userService.createUser(deviceId);
    } else {
      userUUID = user.uuid;
    }

    return this.createTokens(userUUID);
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
}

export default AuthService;
