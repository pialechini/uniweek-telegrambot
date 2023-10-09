import sampleGolestanSchedule from "../features/week-schedule/sample-golestan-schedule";

function initializeEmptyWeekSchedule(): WeekSchedule {
  return Array.from({ length: 5 }, () =>
    Array(4).fill({ name: null, location: null })
  );
}

function convertTimePeriodToClassIndex(timePeriod: string) {
  console.log(timePeriod);

  switch (timePeriod) {
    case "۰۸:۰۰-۱۰:۰۰":
      return 0;
    case "۱۰:۰۰-۱۲:۰۰":
      return 1;
    case "۱۴:۰۰-۱۶:۰۰":
      return 2;
    case "۱۶:۰۰-۱۸:۰۰":
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

  console.log(weekSchedule);

  return weekSchedule;
}

interface Class {
  name: string | null;
  location: string | null;
}

type DaySchedule = Class[];

type WeekSchedule = DaySchedule[];
