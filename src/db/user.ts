import { tokenToEmail } from '@/helpers';
import createSupabaseClient from '@/services/supabase';
import type { Identity, Schedule, WeekSchedule } from '@/types';

const defaultWeekScheduleUponRegister: WeekSchedule = {
  even_weeks_schedule: Array.from({ length: 7 }).fill([]) as Schedule,
  odd_weeks_schedule: Array.from({ length: 7 }).fill([]) as Schedule,
};

async function createUser(telegramId: number) {
  const token = crypto.randomUUID();
  const email = tokenToEmail(token);
  const supabase = createSupabaseClient();

  const { data, error: signupError } = await supabase.auth.signUp({
    email,
    password: email,
  });

  if (signupError) {
    console.error('signup failed', signupError.message);
    return;
  }

  const identity = {
    user_id: data.user!.id,
    telegram_id: telegramId,
    token,
  };

  const { error: identityCreationError } = await supabase
    .from('identities')
    .insert(identity);

  if (identityCreationError) {
    console.error(
      'telegramId insertion failed',
      JSON.stringify(identityCreationError),
    );
    return;
  }

  const { error: defaultWeekScheduleCreationError } = await supabase
    .from('week_schedules')
    .insert({
      token,
      user_id: data.user!.id,
      week_schedule: defaultWeekScheduleUponRegister,
    });

  if (defaultWeekScheduleCreationError) {
    console.error(
      'default week schedule insertion failed',
      JSON.stringify(defaultWeekScheduleCreationError),
    );
    return;
  }

  return identity as Identity;
}

async function findIdentity(telegramId: number) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('identities')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  if (!data) {
    console.trace(error);
    return;
  }

  return data as Identity;
}

export { createUser, findIdentity };
