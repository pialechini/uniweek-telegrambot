import sampleGolestanSchedule from '../features/week-schedule/sample-golestan-schedule';

function initializeEmptyWeekSchedule(): WeekSchedule {
  return Array.from({ length: 5 }, () =>
    Array(4).fill({ name: null, location: null })
  );
}

function convertTimePeriodToClassIndex(timePeriod: string) {
  switch (timePeriod) {
    case "08:00-10:00":
      return 0;
    case "10:00-12:00":
      return 1;
    case "14:00-16:00":
      return 2;
    case "16:00-18:00":
      return 3;
  }
}

function replaceLatinNumbersWithPersian(text: string) {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return text.replace(/[0-9]/g, (match) => persianNumbers[Number(match)]);
}

function formatClassName(name: string) {
  return replaceLatinNumbersWithPersian(name).replace(/ي/g, "ی");
}

function formatClassLocation(location: string) {
  return replaceLatinNumbersWithPersian(location)
    .replace(/ي/g, "ی")
    .replace("-", " - ")
    .replace("/", "");
}

export function constructWeekSchedule(
  evenOdd: "even" | "odd",
  golestanSchedule: typeof sampleGolestanSchedule
): WeekSchedule {
  const weekSchedule = initializeEmptyWeekSchedule();

  for (const course of golestanSchedule) {
    for (const dayIndex in course.days) {
      const day = course.days[dayIndex];

      if (day !== null && (day.evenOdd == evenOdd || day.evenOdd == null)) {
        weekSchedule[dayIndex][convertTimePeriodToClassIndex(day.time)!] = {
          name: formatClassName(course.name),
          location: formatClassLocation(day.location),
        };
      }
    }
  }

  return weekSchedule;
}

interface Class {
  name: string | null;
  location: string | null;
}

type DaySchedule = Class[];

type WeekSchedule = DaySchedule[];
