export interface SendNotificationDto {
  to: string;
  title: string;
  subtitle?: string;
  body: string;
  sound?: string;
  data?: object;
  image?: string;
}

export interface SendNotificationRes {
  data: {
    status: string;
    id: string;
  };
}
