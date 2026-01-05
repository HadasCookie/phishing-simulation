import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PhishingAttemptsController } from './phishing-attempts.controller';
import { PhishingAttemptsService } from './phishing-attempts.service';
import {
  PhishingAttemptManagement,
  PhishingAttemptManagementSchema,
} from './phishing-attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PhishingAttemptManagement.name,
        schema: PhishingAttemptManagementSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [PhishingAttemptsController],
  providers: [PhishingAttemptsService],
})
export class PhishingAttemptsModule {}
