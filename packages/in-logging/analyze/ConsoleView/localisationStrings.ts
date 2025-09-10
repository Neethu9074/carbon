/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from 'in-i18n';

export const localisationStrings = {
  tailing: t('in-logging:console.tailing'),
  searchIndex: (at: number, of: number) => t('in-logging:console.searchIndex', { at, of })
} as const;
