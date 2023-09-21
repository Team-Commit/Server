import { LetterDAO } from '../database/models/letter';
import { Letter } from '../types/types';

class ModelConverter {
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
