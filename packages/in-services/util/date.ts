/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isBefore, isEqual, isSameDay, startOfDay, startOfWeek } from 'date-fns';

export function isOnSameDay(time1: number, time2: number) {
  return isSameDay(time1, time2);
}

export function roundDownToWeek(timestamp: number) {
  return startOfWeek(timestamp).getTime();
}

export function isSameDayOrBefore(fromDate: Date, toDate: Date) {
  const from = startOfDay(fromDate);
  const to = startOfDay(toDate);

  return isBefore(from, to) || isEqual(from, to);
}
