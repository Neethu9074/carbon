/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import Pill from 'in-components/Pill/Pill';
import { t } from 'in-i18n';

export default function AlertEnabledStateColumn({ enabled }) {
  return enabled ? null : (
    <Pill kind="info"> {t('in-alerting:smartAlerts.applications.apCreation.alertCurrentlyDisabled')}</Pill>
  );
}
