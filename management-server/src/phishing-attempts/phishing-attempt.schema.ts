import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PhishingAttemptManagement extends Document {
  @Prop({ required: true })
  targetEmail: string;

  @Prop({ required: true })
  emailSubject: string;

  @Prop({ required: true })
  emailContent: string;

  @Prop({ required: true })
  status: string; // PENDING, SENT, CLICKED

  @Prop({ required: true })
  createdBy: string; // userId

  @Prop({ required: true })
  trackingToken: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  sentAt: Date;

  @Prop()
  clickedAt: Date;
}

export const PhishingAttemptManagementSchema = SchemaFactory.createForClass(
  PhishingAttemptManagement,
);
