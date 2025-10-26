
import { sendPasswordSetupEmail } from '../../infrastructure/messaging/publisher';
import { log } from '../../shared/logger';
import { passwordSetupSchema } from '../validators/passwordSetupSchema';

export async function passwordSetupHandler(context: any, req: any) {
  const correlationId = req.headers['x-correlation-id'] || Date.now().toString();
  try {
    const result = passwordSetupSchema.safeParse(req.body);
    if (!result.success) {
      log('error', 'Validation failed', { correlationId, errors: result.error.errors });
      context.res = { status: 400, body: { message: 'Invalid payload', errors: result.error.errors } };
      return;
    }

    await sendPasswordSetupEmail(req.body);
  log('info', `Password setup email sent to ${req.body.teacher_email}`, { correlationId });
    context.res = {
      status: 200,
      body: {
        status: 'email_sent',
        teacher_id: req.body.teacher_id,
        sent_at: new Date().toISOString()
      }
    };
  } catch (err: any) {
  log('error', 'Email provider failure', { correlationId, error: err });
  context.res = { status: 500, body: { error: err.message || 'SMTP timeout' } };
  }
}
