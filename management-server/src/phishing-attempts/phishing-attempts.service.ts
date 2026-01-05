import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhishingAttemptManagement } from './phishing-attempt.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PhishingAttemptsService {
  constructor(
    @InjectModel(PhishingAttemptManagement.name)
    private phishingAttemptModel: Model<PhishingAttemptManagement>,
    private httpService: HttpService,
  ) {}

  async createAttempt(
    targetEmail: string,
    emailSubject: string,
    emailContent: string,
    userId: string,
  ) {
    // Generate unique tracking token
    const trackingToken = `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Save to management database
    const newAttempt = new this.phishingAttemptModel({
      targetEmail,
      emailSubject,
      emailContent,
      status: 'PENDING',
      createdBy: userId,
      trackingToken,
    });
    await newAttempt.save();

    // Call Server 1 (Phishing Simulation) to send email
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3001/phishing/send', {
          targetEmail,
          emailSubject,
          emailContent,
          attemptId: newAttempt._id.toString(),
          trackingToken,
        }),
      );

      // Update status to SENT
      newAttempt.status = 'SENT';
      newAttempt.sentAt = new Date();
      await newAttempt.save();

      return {
        message: 'Phishing attempt created and email sent',
        attempt: newAttempt,
        trackingLink: response.data.trackingLink,
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        message: 'Phishing attempt created but email failed to send',
        attempt: newAttempt,
      };
    }
  }

  async getAllAttempts(userId: string) {
    return await this.phishingAttemptModel
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(trackingToken: string, status: string) {
    const attempt = await this.phishingAttemptModel.findOne({ trackingToken });

    if (!attempt) {
      return null;
    }

    attempt.status = status;
    if (status === 'CLICKED') {
      attempt.clickedAt = new Date();
    }
    await attempt.save();

    return attempt;
  }
}
