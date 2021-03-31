/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const modes = {
  0: t('in-forge:plugins.instanaAgent.disabled'),
  1: t('in-forge:plugins.instanaAgent.infrastructure'),
  2: t('in-forge:plugins.instanaAgent.apm')
};

export const logLevels = {
  ERROR: 'Error',
  WARNING: 'Warning',
  INFO: 'Info',
  DEBUG: 'Debug'
};
