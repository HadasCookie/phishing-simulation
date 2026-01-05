import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PhishingAttempt extends Document {
  @Prop({ required: true })
  targetEmail: string;

  @Prop({ required: true })
  emailSubject: string;

  @Prop({ required: true })
  emailContent: string;

  @Prop({ required: true, default: 'PENDING' })
  status: string;

  @Prop()
  attemptId: string;

  @Prop({ required: true })
  trackingToken: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  sentAt: Date;

  @Prop()
  clickedAt: Date;
}

export const PhishingAttemptSchema =
  SchemaFactory.createForClass(PhishingAttempt);
