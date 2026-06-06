import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDataset extends Document {
  name: string;
  description: string;
  blobUrl: string;
  rowCount: number;
  colCount: number;
  columns: { name: string; type: string }[];
  preview: mongoose.Schema.Types.Mixed;
  tags: string[];
  uploadedAt: Date;
}

const DatasetSchema = new Schema<IDataset>({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  blobUrl:     { type: String, required: true },
  rowCount:    { type: Number, default: 0 },
  colCount:    { type: Number, default: 0 },
  columns:     [{ name: String, type: String }],
  preview:     { type: Schema.Types.Mixed },
  tags:        [String],
  uploadedAt:  { type: Date, default: Date.now },
});

const DatasetModel: Model<IDataset> =
  mongoose.models.Dataset || mongoose.model<IDataset>('Dataset', DatasetSchema);

export default DatasetModel;
