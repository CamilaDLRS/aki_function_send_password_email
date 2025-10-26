import sgMail from '@sendgrid/mail';
import { log } from '../../shared/logger';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendPasswordSetupEmail(
  data: {
    teacher_id: number;
    teacher_email: string;
    teacher_name: string;
    token: string;
    expires_at: string;
    emailType: 'setup' | 'recovery';
  },
) {
  const link = `https://http.dog/501`;
  let subject: string;
  let html: string;
  if (data.emailType === 'setup') {
    subject = 'Set up your AKI password';
    html = `<p>Welcome to AKI, ${data.teacher_name}!<br>Click <a href='${link}'>here</a> to set your password.<br>This link expires at ${data.expires_at}.</p>`;
  } else {
    subject = 'Recover your AKI password';
    html = `<p>Hello ${data.teacher_name},<br>Click <a href='${link}'>here</a> to reset your password.<br>This link expires at ${data.expires_at}.</p>`;
  }
  const msg = {
    to: data.teacher_email,
    from: 'camila.delarosa@pucpr.edu.br',
    subject,
    html,
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
