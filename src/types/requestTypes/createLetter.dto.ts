import { IsString, MaxLength, MinLength } from 'class-validator';
import { CreateLetterForm } from '../types';

class CreateLetterDto {
  @MinLength(10, {
    message: 'Letter is too short',
  })
  @MaxLength(30, {
    message: 'Letter is too long',
  })
  @IsString()
    content: string;

  constructor(obj: CreateLetterDto) {
    this.content = obj.content;
  }

  toServiceModel(): CreateLetterForm {
    return {
      content: this.content,
    };
  }
}

export default CreateLetterDto;
