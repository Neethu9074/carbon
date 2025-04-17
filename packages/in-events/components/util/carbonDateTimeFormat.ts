/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getSingle } from 'in-services/settings/settings';
import { activeLanguage } from 'in-i18n';

/**
 * Convert the timestamp to a formatted date string according to user settings
 * @param timestamp - timestamp in milliseconds
 * @returns string
 */
export const formatCarbonDate = (timestamp: number) => {
  const dtfDate = new Intl.DateTimeFormat(activeLanguage, {
    dateStyle: 'medium',
    timeZone: getSingle('formatTimestampsAsUtc') ? 'UTC' : undefined
  });

  return dtfDate.format(timestamp);
};

/**
 * Convert the timestamp to a formatted time string according to user settings
 * @param timestamp - timestamp in milliseconds
 * @returns string
 */
export const formatCarbonTime = (timestamp: number) => {
  const dtfTime = new Intl.DateTimeFormat(activeLanguage, {
    timeStyle: 'medium',
    timeZone: getSingle('formatTimestampsAsUtc') ? 'UTC' : undefined
  });

  return dtfTime.format(timestamp);
};
