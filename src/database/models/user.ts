import { Model, model, Schema } from 'mongoose';

interface UserDAO {
  uuid: string;
  deviceId: string;
  point: number;
}

type UserDAOModel = Model<UserDAO>;

const userSchema = new Schema<UserDAO, UserDAOModel>(
  {
    uuid: { type: String, required: true, unique: true }, // 유저 식별 uuid
    deviceId: { type: String, required: true, unique: true }, // 유저 식별 uuid
    point: { type: Number, required: true, default: 1 }, // 읽을 수 있는 편지 개수
  },
  {
    timestamps: true,
  },
);

const UserModel = model<UserDAO, UserDAOModel>('User', userSchema);

export { UserModel, UserDAO };
