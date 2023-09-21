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
export type { Letter, CreateLetterForm, SignInForm };
