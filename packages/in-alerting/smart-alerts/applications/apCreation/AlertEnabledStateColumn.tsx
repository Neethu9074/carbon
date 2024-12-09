/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Pill } from '@instana/components';

import { t } from 'in-i18n';

export default function AlertEnabledStateColumn({ enabled }: { enabled: boolean }) {
  return enabled ? null : (
    <Pill type="gray">{t('in-alerting:smartAlerts.applications.apCreation.alertCurrentlyDisabled')}</Pill>
  );
}
