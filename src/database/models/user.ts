import { Model, model, Schema } from 'mongoose';

interface UserDAO {
  uuid: string;
  deviceId: string;
  nickname: string;
  point: number;
  send: number;
  receive: number;
  sound: boolean;
  alarm: boolean;
}

type UserDAOModel = Model<UserDAO>;

const userSchema = new Schema<UserDAO, UserDAOModel>(
  {
    uuid: { type: String, required: true, unique: true }, // 유저 식별 uuid
    deviceId: { type: String, required: true, unique: true }, // 유저 식별 uuid
    nickname: { type: String, required: true }, // 유저 닉네임
    point: { type: Number, required: true, default: 3 }, // 읽을 수 있는 편지 개수
    send: { type: Number, required: true, default: 0 }, // 읽을 수 있는 편지 개수
    receive: { type: Number, required: true, default: 0 }, // 읽을 수 있는 편지 개수
    sound: { type: Boolean, required: true, default: true }, // 사운드 표시 여부
    alarm: { type: Boolean, required: true, default: true }, // 알람 수신 여부
  },
  {
    timestamps: true,
  },
);

const UserModel = model<UserDAO, UserDAOModel>('User', userSchema);

export { UserModel, UserDAO };
