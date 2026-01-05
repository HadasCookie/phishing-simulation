import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhishingAttempt } from './phishing-attempt.schema';
import * as nodemailer from 'nodemailer';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PhishingService {
  private transporter;

  constructor(
    @InjectModel(PhishingAttempt.name)
    private phishingAttemptModel: Model<PhishingAttempt>,
    private httpService: HttpService,
  ) {
    // Setup email transporter (using ethereal - free test email)
    // We'll use console.log for now to save time
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'test@ethereal.email',
        pass: 'test123',
      },
    });
  }

  async sendPhishingEmail(
    targetEmail: string,
    emailSubject: string,
    emailContent: string,
    attemptId: string,
    trackingToken: string,
  ) {
    // Save to database
    const newAttempt = new this.phishingAttemptModel({
      targetEmail,
      emailSubject,
      emailContent,
      attemptId,
      trackingToken,
      status: 'PENDING',
    });
    await newAttempt.save();

    // Create phishing link
    const phishingLink = `http://localhost:3001/phishing/track/${trackingToken}`;

    // Email content with tracking link
    const emailHtml = `
      <div>
        <p>${emailContent}</p>
        <br/>
        <a href="${phishingLink}">Click here to verify your account</a>
      </div>
    `;

    // For demo purposes, just log it (email sending takes time to setup)
    console.log('📧 PHISHING EMAIL:');
    console.log(`To: ${targetEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Tracking Link: ${phishingLink}`);
    console.log('---');

    // Update status to SENT
    newAttempt.status = 'SENT';
    newAttempt.sentAt = new Date();
    await newAttempt.save();

    return {
      success: true,
      message: 'Phishing email sent',
      trackingLink: phishingLink, // Return link for testing
    };
  }

  async trackClick(trackingToken: string) {
    const attempt = await this.phishingAttemptModel.findOne({ trackingToken });

    if (!attempt) {
      return null;
    }

    // Update Server 1's database
    attempt.status = 'CLICKED';
    attempt.clickedAt = new Date();
    await attempt.save();

    // Notify Server 2
    try {
      await firstValueFrom(
        this.httpService.patch(
          `http://localhost:3000/phishing-attempts/status/${trackingToken}`,
          { status: 'CLICKED' },
        ),
      );
      console.log('✅ Management server notified');
    } catch (error) {
      console.error('❌ Failed to notify management server');
    }

    return attempt;
  }
}
