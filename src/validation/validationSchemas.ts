import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*                                   REGEXes                                  */
/* -------------------------------------------------------------------------- */

// HH:MM-HH:MM
const HHMM = /([01][0-9]|2[0-3]):([0-5][0-9])/;
const TIME_FORMAT = new RegExp(`^${HHMM.source}-${HHMM.source}$`);

/* -------------------------------------------------------------------------- */
/*                                   SCHEMAS                                  */
/* -------------------------------------------------------------------------- */
const TIME_SCHEMA = z
  .string()
  .regex(TIME_FORMAT, 'Time must be in HH:MM-HH:MM format');

const KLASS_SCHEMA = z.string().min(1, 'Class name is required');
const LOCATION_SCHEMA = z.string().min(1, 'Location is required');
const DAYS_SCHEMA = z.array(
  z.number().int().min(0).max(5, 'Day must be between 0 and 5'),
);
const EVEN_ODD_SCHEMA = z.enum(['even', 'odd', 'both']);

export const createKlassSessionRequestBodySchema = z.object({
  klass: KLASS_SCHEMA,
  location: LOCATION_SCHEMA,
  time: TIME_SCHEMA,
  days: DAYS_SCHEMA,
  even_odd: EVEN_ODD_SCHEMA,
});

export const updateKlassSessionRequestBodySchema = z.object({
  day: z.number().int().min(0).max(5, 'Day must be between 0 and 5'),
  even_odd: z.enum(['even', 'odd', 'both']),
  time: TIME_SCHEMA,
  updatedSession: z
    .object({
      klass: KLASS_SCHEMA.optional(),
      time: TIME_SCHEMA.optional(),
      location: LOCATION_SCHEMA.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be updated',
    }),
});

export const deleteKlassSessionRequestBodySchema = z.object({
  day: DAYS_SCHEMA,
  even_odd: EVEN_ODD_SCHEMA,
  time: TIME_SCHEMA,
});
