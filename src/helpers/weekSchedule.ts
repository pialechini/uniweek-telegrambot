import { WebError } from '@/error';
import type {
  DaySchedule,
  KlassSession,
  KlassSessionTime,
  Schedule,
} from '@/types';
import { cloneDeep } from 'lodash';

function addSessionToSchedule(
  session: KlassSession,
  day: number,
  schedule: Schedule,
) {
  const newSchedule = cloneDeep(schedule);

  if (checkOverlapWithSchedule(session, schedule)) {
    throw new Error('The session overlaps with an existing session.');
  }

  newSchedule[day].push(session);

  newSchedule[day].sort((a, b) => a.time.localeCompare(b.time));

  return newSchedule;
}

function parseTime(time: string) {
  const [startTime, endTime] = time.split('-');

  if (!startTime || !endTime) {
    throw new WebError(400, 'invalid time format');
  }

  return [startTime, endTime];
}

function stringifyTime(time: KlassSessionTime) {
  return time.start + '-' + time.end;
}

function checkOverlap(session1: KlassSession, session2: KlassSession) {
  const [start1, end1] = parseTime(session1.time);
  const [start2, end2] = parseTime(session2.time);

  return start1 < end2 && start2 < end1;
}

function checkOverlapWithDaySchedule(
  session: KlassSession,
  daySchedule: DaySchedule,
) {
  return daySchedule.some((existingSession) =>
    checkOverlap(session, existingSession),
  );
}

function checkOverlapWithSchedule(
  session: KlassSession,
  schedule: Schedule,
): boolean {
  return schedule.some((daySchedule) =>
    checkOverlapWithDaySchedule(session, daySchedule),
  );
}

export {
  addSessionToSchedule,
  parseTime,
  stringifyTime,
  checkOverlap,
  checkOverlapWithDaySchedule,
  checkOverlapWithSchedule,
};
