/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CarbonInlineLoading } from '@instana/components';

import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

export const MAP_CARBON_STATUS: Record<FetchStatus | '', Parameters<typeof CarbonInlineLoading>[0]['status']> =
  Object.freeze({
    resolved: 'finished',
    rejected: undefined,
    pending: 'active',
    '': 'inactive'
  });
export const SAVE_DESCRIPTIONS: Record<FetchStatus | '', string> = Object.freeze({
  resolved: t('in-settings:tabs.changesSaved'),
  rejected: t('in-settings:tabs.authenticationProviders.failedToSaveConfig'),
  pending: t('in-settings:tabs.savingConfig'),
  '': ''
});
export const TEST_DESCRIPTIONS: Record<FetchStatus | '', string> = Object.freeze({
  pending: t('in-settings:tabs.loading'),
  rejected: t('in-settings:tabs.ldapTestFailed'),
  resolved: '',
  '': ''
});
export const DELETE_DESCRIPTIONS: Record<FetchStatus | '', string> = Object.freeze({
  pending: t('in-settings:tabs.deletingConfig'),
  resolved: t('in-settings:tabs.changesSaved'),
  rejected: t('in-settings:tabs.authenticationProviders.failedToDeleteConfig'),
  '': ''
});
