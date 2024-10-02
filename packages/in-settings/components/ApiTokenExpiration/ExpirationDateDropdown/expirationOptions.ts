/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const expirationOptions = Object.freeze([
  { key: 30, label: t('in-settings:tabs.apiTokenExpirationOptions.thirtyDays'), value: '30 days' },
  { key: 60, label: t('in-settings:tabs.apiTokenExpirationOptions.sixtyDays'), value: '60 days' },
  { key: 90, label: t('in-settings:tabs.apiTokenExpirationOptions.ninetyDays'), value: '90 days' },
  { key: 365, label: t('in-settings:tabs.apiTokenExpirationOptions.oneYear'), value: '1 year' },
  { key: 'Custom', label: t('in-settings:tabs.apiTokenExpirationOptions.custom'), value: 'Custom' },
  { key: 'Never', label: t('in-settings:tabs.apiTokenExpirationOptions.never'), value: 'Never' }
]);
