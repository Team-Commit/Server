import { v4 } from 'uuid';
import { UserModel } from '../../database/models/user';

class UserService {
  private static instance: UserService;

  private constructor() {}

  async createUser(deviceId: string): Promise<string> {
    const uuid = v4();

    await new UserModel({
      uuid: uuid,
      deviceId: deviceId,
      point: 3,
    }).save();

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
