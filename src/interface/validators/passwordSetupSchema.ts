import { z } from 'zod';

export const passwordSetupSchema = z.object({
  teacher_id: z.number().int(),
  teacher_email: z.string().email(),
  teacher_name: z.string().min(1),
  token: z.string().min(1),
  expires_at: z.string().min(1),
  emailType: z.enum(['setup', 'recovery']).optional(),
});
