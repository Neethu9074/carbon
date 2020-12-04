import moment from 'moment';

export function isOnSameDay(time1, time2) {
  return moment(time1).isSame(moment(time2), 'day');
}

export function roundDownToWeek(timestamp) {
  return moment(timestamp)
    .startOf('week')
    .valueOf();
}
