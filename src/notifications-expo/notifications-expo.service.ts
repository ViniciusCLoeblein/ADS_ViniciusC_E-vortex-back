import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SendNotificationDto, SendNotificationRes } from './utils/interface';

@Injectable()
export class NotificationsExpoService {
  constructor(private readonly http: HttpService) {}

  async sendNotification(
    payload: SendNotificationDto,
  ): Promise<SendNotificationRes> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<SendNotificationRes>('/send', {
          ...payload,
          sound: payload?.sound || 'default',
          ...(payload.image
            ? {
                richContent: {
                  image: payload.image,
                },
              }
            : {}),
        }),
      );
      return data;
    } catch (error) {
      throw new Error(`Falha ao enviar notificação: ${error.message}`);
    }
  }
}
