import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
    const resetLink = `${frontendUrl}/authentication/reset-password?token=${token}`;
    const nodeEnv = this.configService.get('NODE_ENV', 'development');

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password - Clientra',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #673ab7; text-align: center;">Clientra</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Please click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #673ab7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 Clientra. All rights reserved.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
      
      if (nodeEnv === 'development') {
        this.logger.warn(`[DEVELOPMENT MODE] Email delivery failed. You can manualy use this link to reset password:`);
        this.logger.warn(`👉 ${resetLink}`);
      }
      
      // We don't re-throw the error to ensure the API response remains successful (200 OK)
      // and doesn't leak whether an email exists or not via status code.
    }
  }
}
