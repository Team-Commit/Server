import { GetUserForm } from '../types';

class GetUserDto {
  nickname: string;

  point: number;

  send: number;

  receive: number;

  sound: boolean;

  alarm: boolean;

  constructor(obj: GetUserForm) {
    this.nickname = obj.nickname;
    this.point = obj.point;
    this.send = obj.send;
    this.receive = obj.receive;
    this.sound = obj.sound;
    this.alarm = obj.alarm;
  }
}

export default GetUserDto;
