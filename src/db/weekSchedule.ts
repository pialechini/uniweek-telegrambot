import errors from '@/bot/errors';
import { WebError } from '@/error';
import createSupabaseClient from '@/services/supabase';
import { Schedule, WeekSchedule } from '@/types';

async function fetchWeekSchedule(token: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
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
  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from('week_schedules')
    .update({
      week_schedule: {
        even_weeks_schedule,
        odd_weeks_schedule,
      },
    })
    .eq('token', token);

  if (error) {
    throw new WebError(500, errors.database.general);
  }
}

export { fetchWeekSchedule, updateWeekSchedule };
