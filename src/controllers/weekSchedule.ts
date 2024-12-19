import { fetchWeekSchedule, updateWeekSchedule } from '@/db/weekSchedule';
import { WebError } from '@/error';
import { addSessionToSchedule } from '@/helpers';
import type {
  CreateKlassSessionResponse,
  DeleteKlassSessionRequestBody,
  Schedule,
  UpdateKlassSessionRequestBody,
  WeekScheduleRequest,
} from '@/types';
import validate from '@/validation/validate';
import { createKlassSessionRequestBodySchema } from '@/validation/validationSchemas';
import { difference, union } from 'lodash';

async function createKlassSession(
  req: WeekScheduleRequest<unknown>,
  res,
  next,
) {
  try {
    const parsedBody = validate(createKlassSessionRequestBodySchema, req.body);
    const { klass, time, location, days, even_odd } = parsedBody;
    const session = { klass, time, location };

    // Fetch existing schedules
    let { even_weeks_schedule, odd_weeks_schedule } = await fetchWeekSchedule(
      req.params.token,
    );

    const arrayOfDays = Array.isArray(days) ? days : [days];
    let successfullyAddedDays: number[] = [];
    let conflictingDays: number[] = [];

    // Add session to all specified days
    if (even_odd === 'even' || even_odd === 'both') {
      const [updatedSchedule, daysWithConflict] = addSessionToSchedule(
        session,
        arrayOfDays,
        even_weeks_schedule,
      );

      even_weeks_schedule = updatedSchedule;
      conflictingDays = union(conflictingDays, daysWithConflict);
    }

    if (even_odd === 'odd' || even_odd === 'both') {
      const [updatedSchedule, daysWithConflict] = addSessionToSchedule(
        session,
        days,
        odd_weeks_schedule,
      );

      odd_weeks_schedule = updatedSchedule;
      conflictingDays = union(conflictingDays, daysWithConflict);
    }

    successfullyAddedDays = difference(days, conflictingDays);

    await updateWeekSchedule(
      req.params.token,
      even_weeks_schedule,
      odd_weeks_schedule,
    );

    res.status(200).json({
      success: true,
      status: 200,
      details: {
        message: 'Session added successfully',
        successfullyAddedDays,
        conflictingDays,
      },
    } as CreateKlassSessionResponse);
  } catch (err) {
    next(err); // Pass errors to the global error handler
  }
}

async function updateKlassSession(
  req: WeekScheduleRequest<UpdateKlassSessionRequestBody>,
  res,
) {
  const { token } = req.params;
  const { even_odd, day, time, updatedSession } = req.body;

  // Validation
  if (!even_odd || day === undefined || !time || !updatedSession) {
    throw new WebError(400, 'Missing required fields');
  }

  // Fetch the current schedules
  const { even_weeks_schedule, odd_weeks_schedule } =
    await fetchWeekSchedule(token);

  // Function to update a session
  const updateSession = (schedule: Schedule) => {
    schedule[day] = schedule[day].map((session) => {
      if (session.time === time) {
        return { ...session, ...updatedSession }; // Merge updates
      }
      return session;
    });
  };

  // Update sessions in the appropriate schedule(s)
  switch (even_odd) {
    case 'even':
      updateSession(even_weeks_schedule);
      break;
    case 'odd':
      updateSession(odd_weeks_schedule);
      break;
    case 'both':
      updateSession(even_weeks_schedule);
      updateSession(odd_weeks_schedule);
      break;
    default:
      throw new WebError(400, "Invalid value for 'even_odd'");
  }

  // Persist the updates to the database
  await updateWeekSchedule(token, even_weeks_schedule, odd_weeks_schedule);

  res.status(200).json({ message: 'Session updated successfully' });
}

async function deleteKlassSession(
  req: WeekScheduleRequest<DeleteKlassSessionRequestBody>,
  res,
) {
  const { token } = req.params;
  const { even_odd, day, time } = req.body;

  // Validation
  if (!even_odd || day === undefined || !time) {
    throw new WebError(400, 'Missing required fields');
  }

  const { even_weeks_schedule, odd_weeks_schedule } =
    await fetchWeekSchedule(token);

  const scheduleToUpdate =
    even_odd === 'even' ? even_weeks_schedule : odd_weeks_schedule;

  scheduleToUpdate[day] = scheduleToUpdate[day].filter((session) => {
    return session.time !== time;
  });

  switch (even_odd) {
    case 'even':
      await updateWeekSchedule(token, scheduleToUpdate, odd_weeks_schedule);
      break;
    case 'odd':
      await updateWeekSchedule(token, even_weeks_schedule, scheduleToUpdate);
      break;
    case 'both':
      await updateWeekSchedule(token, scheduleToUpdate, scheduleToUpdate);
      break;
  }

  res.status(200).json({ message: 'Session deleted successfully' });
}

export { createKlassSession, updateKlassSession, deleteKlassSession };
