import { IsString } from 'class-validator';
import { RefreshTokenForm } from '../types';

class RefreshTokenDto {
  @IsString()
    token: string;

  constructor(obj: RefreshTokenDto) {
    this.token = obj.token;
  }

  toServiceModel(): RefreshTokenForm {
    return {
      token: this.token,
    };
  }
}

export default RefreshTokenDto;
