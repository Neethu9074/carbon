/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Message } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Trans } from 'in-i18n';

import locals from './MetricExplosionNotification.mless';

interface MetricExplosionNotificationProps {
  snapshot: SnapshotData;
}

export default function MetricExplosionNotification({ snapshot }: MetricExplosionNotificationProps) {
  if (snapshot.getIn(['data', 'metricExplosion'])) {
    return (
      <Message type="warning" withIcon className={locals.message}>
        <Trans
          i18nKey="in-infrastructure:dashboard.metricExplosion"
          values={{ maxMetrics: snapshot.getIn(['data', 'metricExplosion']) }}
        />
      </Message>
    );
  }
  return null;
}
