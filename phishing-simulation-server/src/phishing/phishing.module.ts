import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingController } from './phishing.controller';
import { PhishingService } from './phishing.service';
import { HttpModule } from '@nestjs/axios';
import {
  PhishingAttempt,
  PhishingAttemptSchema,
} from './phishing-attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhishingAttempt.name, schema: PhishingAttemptSchema },
    ]),
    HttpModule,
  ],
  controllers: [PhishingController],
  providers: [PhishingService],
})
export class PhishingModule {}
