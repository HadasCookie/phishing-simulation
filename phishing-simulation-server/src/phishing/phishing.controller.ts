import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import type { Response } from 'express';

@Controller('phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Post('send')
  async sendPhishingEmail(
    @Body()
    body: {
      targetEmail: string;
      emailSubject: string;
      emailContent: string;
      attemptId: string;
      trackingToken: string;
    },
  ) {
    const {
      targetEmail,
      emailSubject,
      emailContent,
      attemptId,
      trackingToken,
    } = body;

    return await this.phishingService.sendPhishingEmail(
      targetEmail,
      emailSubject,
      emailContent,
      attemptId,
      trackingToken,
    );
  }

  @Get('track/:token')
  async trackClick(@Param('token') token: string, @Res() res: Response) {
    const attempt = await this.phishingService.trackClick(token);

    if (!attempt) {
      return res.status(404).send('Invalid tracking link');
    }

    // Return HTML page
    return res.send(`
      <html>
        <head>
          <title>Phishing Awareness</title>
          <style>
            body { 
              font-family: Arial; 
              text-align: center; 
              padding: 50px;
              background-color: #fff3cd;
            }
            h1 { color: #856404; }
            p { font-size: 18px; }
          </style>
        </head>
        <body>
          <h1>⚠️ Warning: You Clicked a Phishing Link!</h1>
          <p>This was a phishing simulation test.</p>
          <p>In a real scenario, your information could have been compromised.</p>
          <p>Always verify links before clicking them!</p>
        </body>
      </html>
    `);
  }
}
