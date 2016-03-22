export const timeFormat = 'HH:mm:ss';
export const dateTimeFormat = 'YYYY-MM-DD ' + timeFormat;

export function formatTime(millis) {
  return formatTimeInternal(new Date(millis));
}


export function formatDate(millis) {
  return formatDateInternal(new Date(millis));
}


export function formatDateTime(millis) {
  const date = new Date(millis);
  return `${formatDateInternal(date)} ${formatTimeInternal(date)}`;
}


function formatTimeInternal(date) {
  const hours = ensureTwoChars(date.getHours());
  const minutes = ensureTwoChars(date.getMinutes());
  const seconds = ensureTwoChars(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}


function formatDateInternal(date) {
  const year = date.getFullYear();
  const month = ensureTwoChars(date.getMonth() + 1);
  const day = ensureTwoChars(date.getDate());
  return `${year}-${month}-${day}`;
}


function ensureTwoChars(s) {
  s = String(s);
  if (s.length === 1) {
    return `0${s}`;
  }
  return s;
}
