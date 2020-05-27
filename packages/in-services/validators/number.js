import { isBlank } from 'in-services/util/string';

const failureMessage = [
  {
    severity: 'error',
    message: `Please type in a number.`
  }
];

export function numericValidator(v) {
  if (!v) {
    return null;
  }

  if (typeof v === 'number') {
    return null;
  }

  if (typeof v === 'string') {
    if (isBlank(v)) {
      return null;
    }

    try {
      const num = Number(v);
      if (isNaN(num)) {
        return failureMessage;
      }
      return null;
    } catch (e) {
      return failureMessage;
    }
  }

  return failureMessage;
}

const positiveNumberFailureMessage = [
  {
    severity: 'error',
    message: `Please type in a positive number.`
  }
];

export function positiveNumberValidator(v) {
  try {
    const num = Number(v);
    if (isNaN(num) || num <= 0) {
      return positiveNumberFailureMessage;
    }
    return null;
  } catch (e) {
    return positiveNumberFailureMessage;
  }
}
