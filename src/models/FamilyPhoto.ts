import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFamilyPhoto extends Document {
  blobUrl: string;
  caption: string;
  dateTaken: Date;
  people: string[];
  uploadedAt: Date;
}

const FamilyPhotoSchema = new Schema<IFamilyPhoto>({
  blobUrl:   { type: String, required: true },
  caption:   { type: String, default: '' },
  dateTaken: { type: Date },
  people:    [{ type: String, enum: ['wife', 'son', 'all', 'paulo'] }],
  uploadedAt:{ type: Date, default: Date.now },
});

const FamilyPhotoModel: Model<IFamilyPhoto> =
  mongoose.models.FamilyPhoto || mongoose.model<IFamilyPhoto>('FamilyPhoto', FamilyPhotoSchema);

export default FamilyPhotoModel;
