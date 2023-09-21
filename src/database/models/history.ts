import { Model, model, Schema } from 'mongoose';

interface HistoryDAO {
  user: string;
  letter: string;
}

type HistoryDAOModel = Model<HistoryDAO>;

const historySchema = new Schema<HistoryDAO, HistoryDAOModel>(
  {
    user: { type: String, required: true }, // 편지 식별 uuid
    letter: { type: String, required: true }, // 편지 작성자 유저 식별 uuid
  },
  {
    timestamps: true,
  },
);

const HistoryModel = model<HistoryDAO, HistoryDAOModel>(
  'History',
  historySchema,
);

export { HistoryModel, HistoryDAO };
