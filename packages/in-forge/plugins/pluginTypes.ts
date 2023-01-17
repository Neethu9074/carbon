/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Nullish } from 'in-types';

const appDataTypes = ['application', 'service', 'endpoint'];
const websiteTypes = ['website'];
const syntheticTypes = ['syntheticTest'];

export function isAppDataType(type: string | Nullish): boolean {
  if (type) {
    return appDataTypes.includes(type.toLowerCase());
  }
  return false;
}

export function isWebsiteType(type: string | Nullish): boolean {
  if (type) {
    return websiteTypes.includes(type.toLowerCase());
  }
  return false;
}

export function isSyntheticType(type: string | Nullish): boolean {
  if (type) {
    return syntheticTypes.includes(type.toLowerCase());
  }
  return false;
}
