import { Database } from '@/types';
import type { Request } from 'express';

export type Dict<T> = { [key: string]: T };

export interface Env extends Dict<string | boolean | number | undefined> {
  TELEGRAM_TOKEN: string;
  APP_ENV: 'development' | 'production';
  SUPABASE_KEY: string;
  SUPABASE_URL: string;
  PORT: number;
  MINIAPP_URL: string;
  DEFAULT_PASSWORD_FOR_USERS: string;

  // Development Specific Envs
  //

  // Production Specific Envs
  WEBHOOK_SECRET: string;
  DOMAIN: string;
}

export type ErrorObject = {
  status: number;
  message: string;
  code?: string;
  details?: object;
};

/* -------------------------------------------------------------------------- */
/*                            Domain Defined Types                            */
/* -------------------------------------------------------------------------- */
export type EvenOdd = 'even' | 'odd' | 'both';

export type KlassSession = {
  klass: string;
  time: string;
  location: string;
};

export type KlassSessionTime = {
  start: string;
  end: string;
};

export type DaySchedule = Array<KlassSession>;
export type Schedule = Array<DaySchedule>;

export type WeekSchedule = {
  even_weeks_schedule: Schedule;
  odd_weeks_schedule: Schedule;
};

/* -------------------------------------------------------------------------- */
/*                                  Endpoints                                 */
/* -------------------------------------------------------------------------- */
export type WeekScheduleRequest<Body> = Request<
  { token: string },
  object,
  Body
>;

export type CreateKlassSessionRequestBody = KlassSession & {
  day: number;
  even_odd: EvenOdd;
};

export type UpdateKlassSessionRequestBody = {
  day: number;
  even_odd: EvenOdd;
  time: string;
  updatedSession: Partial<KlassSession>;
};

export type DeleteKlassSessionRequestBody = {
  day: number;
  even_odd: EvenOdd;
  time: string;
};

/* -------------------------------------------------------------------------- */
/*                                  Supabase                                  */
/* -------------------------------------------------------------------------- */

// Custom Derived Types
/* -------------------------------------------------------------------------- */
export type Identity = Database['public']['Tables']['identities']['Insert'];
