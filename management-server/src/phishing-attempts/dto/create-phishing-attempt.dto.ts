import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreatePhishingAttemptDto {
  @IsNotEmpty()
  @IsEmail()
  targetEmail: string;

  @IsNotEmpty()
  emailSubject: string;

  @IsNotEmpty()
  emailContent: string;
}
