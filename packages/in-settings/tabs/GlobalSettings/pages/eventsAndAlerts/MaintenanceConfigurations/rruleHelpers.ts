/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { RRule, Weekday, datetime } from 'rrule';
import { add, sub } from 'date-fns';

export const createRRuleFreq = (
  freq: typeof RRule.MONTHLY | typeof RRule.DAILY | typeof RRule.WEEKLY | typeof RRule.YEARLY
): RRule => {
  const rrule = new RRule({
    freq: freq,
    byweekday: [], // For resetting checkboxes
    interval: freq !== RRule.YEARLY ? 0 : 1 // In the case of a yearly recurrence we need to set the interval to one so the MW recurs every year
  });
  return rrule;
};

export const setRRuleInterval = (rrule: RRule, interval: number): RRule => {
  rrule.options.interval = interval;
  return rrule;
};

/**
 * Convert users input in a date format that rrule recommends.
 *
 * See https://github.com/jkbrzt/rrule/tree/master?tab=readme-ov-file#important-use-utc-dates
 * @param dateStartField user input for date
 * @param timeField user input for time
 * @returns
 */
export const getDateObjectFromRrule = (dateStartField?: String, timeField?: String): Date | null => {
  if (!dateStartField || !timeField) return null;

  // extract date from dateStartField formatted as YYYY-MM-DD
  const [year, month, day] = dateStartField.split('-').map(Number);

  // extract time from timeField formatted as HH:MM:SS
  const [hour, minute, seconds] = timeField.split(':').map(Number);

  const date = datetime(year, month, day, hour, minute, seconds);

  return date;
};

/**
 * Convert rrule's fake "UTC" time to local time format.
 *
 * See https://github.com/jkbrzt/rrule/tree/master?tab=readme-ov-file#important-use-utc-dates
 * @param rruleDate rrule date
 * @returns Date in local timezone
 */
export const formatRruleDateAsLocal = (rruleDate: Date): Date => {
  // Extract components using getUTC* methods, as rrule intends these
  // to be the local time components.
  const year = rruleDate.getUTCFullYear();
  const month = rruleDate.getUTCMonth(); // getUTCMonth() is 0-indexed (0 for January)
  const day = rruleDate.getUTCDate();
  const hours = rruleDate.getUTCHours();
  const minutes = rruleDate.getUTCMinutes();
  const seconds = rruleDate.getUTCSeconds();

  // Create a new Date object. JavaScript's Date constructor, when given
  // these numerical components, assumes they are for the local timezone.
  const localDate = new Date(year, month, day, hours, minutes, seconds);

  return localDate;
};

export const setRRuleDtstart = (rrule: RRule, dateTime: Date): RRule => {
  const resetRRule = new RRule({
    freq: rrule.options.freq,
    interval: rrule.options.interval,
    until: rrule.options.until,
    count: rrule.options.count,
    byweekday: rrule.options.byweekday,
    bymonthday: rrule.options.bymonthday,
    bymonth: rrule.options.bymonth,
    bynmonthday: rrule.options.bynmonthday,
    dtstart: dateTime
  });

  resetRRule.origOptions.byweekday = rrule.origOptions.byweekday;
  return resetRRule;
};

export const setRRuleDateUntil = (rrule: RRule, endDateTime: Date): RRule => {
  const resetRRule = new RRule({
    freq: rrule.options.freq,
    interval: rrule.options.interval,
    dtstart: rrule.options.dtstart,
    byweekday: rrule.options.byweekday,
    bymonthday: rrule.options.bymonthday,
    bymonth: rrule.options.bymonth,
    bynmonthday: rrule.options.bynmonthday,
    until: endDateTime,
    count: null
  });

  resetRRule.origOptions.byweekday = rrule.origOptions.byweekday;
  return resetRRule;
};

export const setRRuleCount = (rrule: RRule, count: number): RRule => {
  rrule.options.count = count;
  rrule.options.until = null;
  return rrule;
};

export const setInfiniteRRule = (rrule: RRule): RRule => {
  rrule.options.count = null;
  rrule.options.until = null;
  return rrule;
};

export const addOrDeleteRRuleByWeekDay = (rrule: RRule, weekdayValue: number): RRule => {
  let weeklyValues = rrule.options.byweekday;
  if (weeklyValues && Array.isArray(weeklyValues)) {
    if (weeklyValues.includes(weekdayValue)) {
      weeklyValues = weeklyValues.filter(val => val !== weekdayValue);
    } else {
      weeklyValues.push(weekdayValue);
    }
    rrule.options.byweekday = weeklyValues;
  } else {
    rrule.options.byweekday = [weekdayValue];
  }
  return rrule;
};

export const setRRuleFirstToLastAndWeekday = (
  rrule: RRule,
  weekdayWithNth: Weekday,
  shouldResetByMonthDay: boolean
): RRule => {
  if (weekdayWithNth && weekdayWithNth.n) {
    rrule.options.bynweekday = [[weekdayWithNth.weekday, weekdayWithNth.n]];
    rrule.origOptions.byweekday = [weekdayWithNth];
  } else {
    rrule.options.bynweekday = [];
    rrule.origOptions.byweekday = [];
  }

  if (shouldResetByMonthDay) rrule = resetRRuleByMonthDay(rrule);
  return rrule;
};

export const setRRuleByMonthDay = (rrule: RRule, monthDay: number, shouldResetWeekday: boolean): RRule => {
  rrule.options.bymonthday = [monthDay];

  if (shouldResetWeekday) rrule = resetRRuleFirstLastWeekday(rrule);

  return rrule;
};

export const setRRuleByMonth = (rrule: RRule, month: number) => {
  if (month >= 0) {
    rrule.options.bymonth = [month];
  } else {
    rrule.options.bymonth = [];
  }
  return rrule;
};

export const resetRRuleFirstLastWeekday = (rrule: RRule): RRule => {
  rrule.options.bynweekday = [];
  rrule.options.byweekday = [];
  rrule.origOptions.byweekday = [];

  return rrule;
};

export const resetRRuleByMonthDay = (rrule: RRule): RRule => {
  rrule.options.bymonthday = [];
  return rrule;
};

export const resetRRuleByMonth = (rrule: RRule): RRule => {
  rrule.options.bymonth = [];
  return rrule;
};

export const resetRRuleWeeklyVars = (rrule: RRule): RRule => {
  rrule.options.byweekday = [];
  return rrule;
};

export const resetRRuleMonthlyVars = (rrule: RRule): RRule => {
  rrule = resetRRuleFirstLastWeekday(rrule);
  rrule = resetRRuleByMonthDay(rrule);

  return rrule;
};

export const resetRRuleYearlyVars = (rrule: RRule): RRule => {
  rrule = resetRRuleFirstLastWeekday(rrule);
  rrule = resetRRuleByMonth(rrule);
  rrule = resetRRuleByMonthDay(rrule);

  return rrule;
};

export const getEndAndTimeDurationOfWindow = (duration: Number, durationUnit: String, startDate: Date): Date => {
  const windowEnd = add(startDate, { [`${durationUnit.toLowerCase()}`]: duration });
  return windowEnd;
};

export const subtractDurationFromGivenTime = (duration: Number, durationUnit: String, startDate: Date): Date => {
  const windowEnd = sub(startDate, { [`${durationUnit.toLowerCase()}`]: duration });
  return windowEnd;
};

export function setPartsToUTCDate(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()));
}

export function setUTCPartsToDate(d: Date) {
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  );
}

export interface StartObject {
  dates: string;
  times: string;
}
