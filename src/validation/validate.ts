import { WebError } from '@/error';
import { z } from 'zod';

function validate<T>(schema: z.ZodSchema<T>, body: unknown): T {
  try {
    return schema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new WebError(400, 'Validation error', {
        issues: err.errors, // Zod validation errors
      });
    } else {
      throw new WebError(500, 'Unexpected error');
    }
  }
}

export default validate;
