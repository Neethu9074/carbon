/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getSapJavaNetWeaverSensor from 'in-sap/subscriptions/getSapJavaNetWeaverSensor';
import { t } from 'in-i18n';

interface HostInfo {
  hostId: string;
  timeConfig: TimeConfig;
}

export default function SapJavaNetWeaverSystemSensorBreadcrumb({ hostId, timeConfig }: HostInfo) {
  const sapJavaNetWeaver = useObservable(
    getSapJavaNetWeaverSensor({
      filter: {
        hostId,
        timeConfig
      }
    }).map(result => result.data),
    [hostId, timeConfig]
  );
  return (
    <Breadcrumb
      label={t('in-sap:breadcrumbs.sapJavaNetWeaverSystemSensor')}
      icon="lib_infra_sapJavaNetWeaverSystemSensor"
    >
      {sapJavaNetWeaver && sapJavaNetWeaver?.label}
    </Breadcrumb>
  );
}
