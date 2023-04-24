/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  number,
  millis,
  percentagePlainZeroDecimalPlaces,
  kiloBytes,
  minutes,
  bytes,
  megaBytes
} from 'in-services/formatters/number';

export function getSAPUnitFormatter(key) {
  if (key === '%') {
    return percentagePlainZeroDecimalPlaces;
  } else if (key === 'ms') {
    return millis;
  } else if (key === 'KB') {
    return kiloBytes;
  } else if (key === 'min') {
    return minutes;
  } else if (key === 'Byt') {
    return bytes;
  } else if (key === 'MB') {
    return megaBytes;
  }
  return number.compact;
}
