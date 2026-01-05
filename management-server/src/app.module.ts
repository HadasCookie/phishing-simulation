import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PhishingAttemptsModule } from './phishing-attempts/phishing-attempts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://haaddaas1_db_user:iQByWTNfDFqKChHP@cluster0.rscky0o.mongodb.net/management-server?appName=Cluster0',
    ),
    UsersModule,
    AuthModule,
    PhishingAttemptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
