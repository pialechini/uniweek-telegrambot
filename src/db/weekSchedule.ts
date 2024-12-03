import errors from '@/bot/errors';
import { WebError } from '@/error';
import { db } from '@/providers';
import { Schedule, WeekSchedule } from '@/types';

async function fetchWeekSchedule(token: string) {
  const { data, error } = await db
    .from('week_schedules')
    .select('week_schedule')
    .eq('token', token)
    .single();

  if (error) {
    throw new WebError(500, errors.database.general);
  }

  return data.week_schedule as WeekSchedule;
}

async function updateWeekSchedule(
  token: string,
  even_weeks_schedule: Schedule,
  odd_weeks_schedule: Schedule,
) {
  const { error } = await db.from('week_schedules').upsert(
    {
      token,
      week_schedule: {
        even_weeks_schedule,
        odd_weeks_schedule,
      },
    },
    { onConflict: 'token' },
  );

  if (error) {
    throw new WebError(500, errors.database.general);
  }
}

export { fetchWeekSchedule, updateWeekSchedule };
