import { Letter } from '../types';

class GetLetterDto {
  user: string;

  content: string;

  like: number;

  constructor(obj: Letter) {
    this.user = obj.user;
    this.content = obj.content;
    this.like = obj.like;
  }
}

export default GetLetterDto;
