import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  title:     { type: String, required: true },
  content:   { type: String, default: '' },
  tags:      [String],
  pinned:    { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const NoteModel: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default NoteModel;
