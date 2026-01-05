import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PhishingAttemptsService } from './phishing-attempts.service';
import { CreatePhishingAttemptDto } from './dto/create-phishing-attempt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('phishing-attempts')
export class PhishingAttemptsController {
  constructor(private phishingAttemptsService: PhishingAttemptsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAttempt(
    @Body() createDto: CreatePhishingAttemptDto,
    @Request() req,
  ) {
    return await this.phishingAttemptsService.createAttempt(
      createDto.targetEmail,
      createDto.emailSubject,
      createDto.emailContent,
      req.user._id,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllAttempts(@Request() req) {
    return await this.phishingAttemptsService.getAllAttempts(req.user._id); // ← PASS USER ID!
  }

  @Patch('status/:token')
  async updateStatus(
    @Param('token') token: string,
    @Body() body: { status: string },
  ) {
    return await this.phishingAttemptsService.updateStatus(token, body.status);
  }
}
