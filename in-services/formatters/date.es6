import moment from 'moment';

export const timeFormat = 'HH:mm:ss';
export const dateTimeFormat = 'YYYY-MM-DD ' + timeFormat;

export function formatTime(millis) {
  // TODO do this manually via the JS Date API for performance
  return moment(millis).format(timeFormat);
}

export function formatDateTime(millis) {
  // TODO do this manually via the JS Date API for performance
  return moment(millis).format(dateTimeFormat);
}
