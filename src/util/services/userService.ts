import { v4 } from 'uuid';
import { UserModel } from '../../database/models/user';

class UserService {
  private static instance: UserService;

  userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  async createUser(deviceId: string): Promise<string> {
    const uuid = v4();

    await new UserModel({
      uuid: uuid,
      deviceId: deviceId,
      point: 3,
    });

    return uuid;
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
}

export default UserService;
