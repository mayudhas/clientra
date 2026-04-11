import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST', 'smtp.ethereal.email'),
          port: config.get('MAIL_PORT', 587),
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.get('MAIL_USER'), // generated ethereal user
            pass: config.get('MAIL_PASS'), // generated ethereal password
          },
        },
        defaults: {
          from: '"No Reply" <noreply@clientra.com>',
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
