type User = {
  uuid: string;
  deviceId: string;
  nickname: string;
  point: number;
  send: number;
  receive: number;
  sound: boolean;
  alarm: boolean;
};

type GetUserForm = {
  nickname: string;
  point: number;
  send: number;
  receive: number;
  sound: boolean;
  alarm: boolean;
};

type LoginUserForm = {
  accessToken: string;
  uuid: string;
  deviceId: string;
  nickname: string;
  point: number;
  send: number;
  receive: number;
  sound: boolean;
  alarm: boolean;
};

type UpdateUserForm = {
  nickname: string;
  sound: boolean;
  alarm: boolean;
};

type Letter = {
  uuid: string;
  user: string;
  content: string;
  like: number;
};

type CreateLetterForm = {
  content: string;
};

type SignInForm = {
  deviceId: string;
};
export type {
  User,
  GetUserForm,
  LoginUserForm,
  UpdateUserForm,
  Letter,
  CreateLetterForm,
  SignInForm,
};
