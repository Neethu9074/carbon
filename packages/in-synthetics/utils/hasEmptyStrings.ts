/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isEmpty } from 'lodash';

const hasEmptyStrings = (obj: { [index: string]: string }) => {
  for (let key in obj) {
    if (!isEmpty(obj) && (obj[key] === '' || key === '')) {
      return true;
    }
  }
  return false;
};

export default hasEmptyStrings;
