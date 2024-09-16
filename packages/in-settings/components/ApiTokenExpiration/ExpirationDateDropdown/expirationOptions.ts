/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const expirationOptions = Object.freeze([
  { value: 30, label: t('in-settings:tabs.apiTokenExpirationOptions.thirtyDays') },
  { value: 60, label: t('in-settings:tabs.apiTokenExpirationOptions.sixtyDays') },
  { value: 90, label: t('in-settings:tabs.apiTokenExpirationOptions.ninetyDays') },
  { value: 365, label: t('in-settings:tabs.apiTokenExpirationOptions.oneYear') },
  { value: 'Custom', label: t('in-settings:tabs.apiTokenExpirationOptions.custom') },
  { value: 'Never', label: t('in-settings:tabs.apiTokenExpirationOptions.never') }
]);
