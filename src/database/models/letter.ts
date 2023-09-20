import { Model, model, Schema } from 'mongoose';

interface LetterDAO {
  uuid: string;
  user: string;
  content: string;
  like: number;
  read: number;
}

type LetterDAOModel = Model<LetterDAO>;

const letterSchema = new Schema<LetterDAO, LetterDAOModel>(
  {
    uuid: { type: String, required: true, unique: true }, // 편지 식별 uuid
    user: { type: String, required: true }, // 편지 작성자 유저 식별 uuid
    content: { type: String, required: true }, // 편지내용
    like: { type: Number, required: true, default: 0 }, // 좋아요 개수
    read: { type: Number, required: true, default: 0 }, // 읽은 개수
  },
  {
    timestamps: true,
  },
);

const LetterModel = model<LetterDAO, LetterDAOModel>('Letter', letterSchema);

export { LetterModel, LetterDAO };
