import { IsString, MaxLength, MinLength } from 'class-validator';
import { CreateLetterForm } from '../types';

class CreateLetterDto {
  @MinLength(10)
  @MaxLength(200)
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
