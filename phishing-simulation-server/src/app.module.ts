import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhishingModule } from './phishing/phishing.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://haaddaas1_db_user:iQByWTNfDFqKChHP@cluster0.rscky0o.mongodb.net/phishing-simulation?appName=Cluster0',
    ),
    PhishingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
