import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KafkaService } from './kaftka.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class MessagingModule {}
