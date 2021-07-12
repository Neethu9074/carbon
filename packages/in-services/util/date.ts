/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import moment from 'moment';

export function isOnSameDay(time1: number, time2: number) {
  return moment(time1).isSame(moment(time2), 'day');
}

export function roundDownToWeek(timestamp: number) {
  return moment(timestamp)
    .startOf('week')
    .valueOf();
}
