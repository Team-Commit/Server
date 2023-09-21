import { v4 } from 'uuid';
import { UserModel } from '../../database/models/user';
import { InternalServerError } from '../middelwares/error/error';
import ErrorCode from '../../types/ErrorTypes/errorCode';
import { UpdateUserForm, User } from '../../types/types';
import ModelConverter from '../../converter/modelConverter';

class UserService {
  private static instance: UserService;

  private constructor() {}

  async createUser(deviceId: string): Promise<User> {
    const uuid = v4();

    const randomNickname = this.createRandomNickname();

    const user = await new UserModel({
      uuid: uuid,
      deviceId: deviceId,
      nickname: randomNickname,
      point: 3,
      send: 0,
      receive: 0,
      sound: true,
      alarm: true,
    }).save();

    return ModelConverter.toUser(user);
  }

  async updateUser(
    userUUID: string,
    updateUserForm: UpdateUserForm,
  ): Promise<User> {
    const user = await UserModel.findOne({ uuid: userUUID });

    if (!user) {
      throw new InternalServerError(ErrorCode.USER_NOT_FOUND, {
        message: 'User not found',
      });
    }

    const { nickname, sound, alarm } = updateUserForm;

    user.nickname = nickname;
    user.sound = sound;
    user.alarm = alarm;

    await user.save();

    return ModelConverter.toUser(user);
  }

  createRandomNickname(): string {
    return 'test';
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
}

export default UserService;
