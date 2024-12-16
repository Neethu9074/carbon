/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function NutanixNoDataNotification(): JSX.Element {
  return <EntityPageMainNotification title={t('in-nutanix:noMonitoringDataFound')} explanation={noop} />;
}
