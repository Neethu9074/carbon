/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isBlank } from 'in-services/util/string';

const hasEmptyElements = (arr: string[]) => {
  return arr.some(element => isBlank(element));
};

export default hasEmptyElements;
