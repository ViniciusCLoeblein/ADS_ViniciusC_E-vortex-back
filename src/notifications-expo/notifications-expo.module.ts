import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { NotificationsExpoService } from './notifications-expo.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.registerAsync({
      useFactory: async () => ({
        baseURL: 'https://exp.host/--/api/v2/push',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  controllers: [],
  providers: [NotificationsExpoService],
  exports: [NotificationsExpoService],
})
export class NotificationsExpoModule {}
