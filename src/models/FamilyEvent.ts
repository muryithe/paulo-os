import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFamilyEvent extends Document {
  title: string;
  date: Date;
  type: 'birthday' | 'anniversary' | 'milestone';
  person: string;
  notes: string;
  recurring: boolean;
}

const FamilyEventSchema = new Schema<IFamilyEvent>({
  title:     { type: String, required: true },
  date:      { type: Date, required: true },
  type:      { type: String, enum: ['birthday', 'anniversary', 'milestone'] },
  person:    { type: String, default: '' },
  notes:     { type: String, default: '' },
  recurring: { type: Boolean, default: true },
});

const FamilyEventModel: Model<IFamilyEvent> =
  mongoose.models.FamilyEvent || mongoose.model<IFamilyEvent>('FamilyEvent', FamilyEventSchema);

export default FamilyEventModel;
