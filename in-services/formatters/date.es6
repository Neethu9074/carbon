export const timeFormat = 'HH:mm:ss';
export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = dateFormat + ' ' + timeFormat;

export function formatTime(millis) {
  return millis ? formatTimeInternal(new Date(millis)) : null;
}


export function formatDate(millis) {
  return millis ? formatDateInternal(new Date(millis)) : null;
}


export function formatDateTime(millis) {
  if (!millis) {
    return null;
  }
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
  if (s < 10) {
    return `0${s}`;
  }
  return s;
}
