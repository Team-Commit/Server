import { LetterDAO } from '../database/models/letter';
import { Letter, User } from '../types/types';
import { UserDAO } from '../database/models/user';

class ModelConverter {
  static toUser(user: UserDAO): User {
    return {
      uuid: user.uuid,
      deviceId: user.deviceId,
      nickname: user.nickname,
      point: user.point,
      send: user.send,
      receive: user.receive,
      sound: user.sound,
      alarm: user.alarm,
    };
  }

  static toLetter(letter: LetterDAO): Letter {
    return {
      uuid: letter.uuid,
      user: letter.user,
      content: letter.content,
      like: letter.like,
    };
  }
}

export default ModelConverter;
