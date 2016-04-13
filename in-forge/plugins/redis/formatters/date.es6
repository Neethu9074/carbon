import {
  formatDateTime
} from 'in-services/formatters/date';

export function formatUnixDateTime(seconds) {
  return formatDateTime(seconds * 1000);
}
