import sgMail from '@sendgrid/mail';
import { log } from '../../shared/logger';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendPasswordSetupEmail(data: {
  teacher_id: number;
  teacher_email: string;
  teacher_name: string;
  token: string;
  expires_at: string;
}) {
  const link = `https://http.dog/501`;
  const msg = {
    to: data.teacher_email,
    from: 'camila.delarosa@pucpr.edu.br',
    subject: 'Set up your AKI password',
    html: `<p>Welcome to AKI, ${data.teacher_name}!<br>Click <a href='${link}'>here</a> to set your password.<br>This link expires at ${data.expires_at}.</p>`
  };

  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    try {
      await sgMail.send(msg);
      return;
    } catch (err: any) {
      log('error', 'SendGrid error', { err });
      attempts++;
      if (attempts >= maxAttempts) throw err;
      await new Promise(res => setTimeout(res, 1000 * attempts));
    }
  }
}
