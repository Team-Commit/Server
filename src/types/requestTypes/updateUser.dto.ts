import {
  IsBoolean, IsString, MaxLength, MinLength,
} from 'class-validator';
import { UpdateUserForm } from '../types';

class UpdateUserDto {
  @IsString()
    nickname: string;

  @IsBoolean()
    sound: boolean;

  @IsBoolean()
    alarm: boolean;

  constructor(obj: UpdateUserDto) {
    this.nickname = obj.nickname;
    this.sound = obj.sound;
    this.alarm = obj.alarm;
  }

  toServiceModel(): UpdateUserForm {
    return {
      nickname: this.nickname,
      sound: this.sound,
      alarm: this.alarm,
    };
  }
}

export default UpdateUserDto;
