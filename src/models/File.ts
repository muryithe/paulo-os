import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFile extends Document {
  name: string;
  blobUrl: string;
  type: string;
  size: number;
  folder: string;
  uploadedAt: Date;
}

const FileSchema = new Schema<IFile>({
  name:       { type: String, required: true },
  blobUrl:    { type: String, required: true },
  type:       { type: String, default: '' },
  size:       { type: Number, default: 0 },
  folder:     { type: String, default: 'all' },
  uploadedAt: { type: Date, default: Date.now },
});

const FileModel: Model<IFile> =
  mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default FileModel;
