import { IsString } from 'class-validator';
import { SignInForm } from '../types';

class SignInDto {
  @IsString()
    deviceId: string;

  constructor(obj: SignInDto) {
    this.deviceId = obj.deviceId;
  }

  toServiceModel(): SignInForm {
    return {
      deviceId: this.deviceId,
    };
  }
}

export default SignInDto;
