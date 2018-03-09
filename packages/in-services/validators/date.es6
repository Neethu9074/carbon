import moment from 'moment';

import { timeFormat, dateFormat } from 'in-services/formatters/date';

import { isBlank } from 'in-services/util/string';

export function timeValidator(v) {
  if (isBlank(v)) {
    return null;
  }

  if (moment(v, timeFormat).isValid()) {
    return null;
  }

  return [
    {
      severity: 'error',
      message: `Time does not have the format ${timeFormat}`
    }
  ];
}

export function dateValidator(v) {
  if (isBlank(v)) {
    return null;
  }

  if (moment(v, dateFormat, true).isValid()) {
    return null;
  }

  return [
    {
      severity: 'error',
      message: `Date does not have the format ${dateFormat}`
    }
  ];
}
