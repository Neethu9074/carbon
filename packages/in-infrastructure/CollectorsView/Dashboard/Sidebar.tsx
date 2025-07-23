/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import { SnapshotItem } from 'in-infrastructure/CollectorsView/Dashboard/CollectorDashboard';
import Info from 'in-forge/plugins/openTelemetry/Info';
import { t } from 'in-i18n';

interface Props {
  snapshot: SnapshotItem;
}

export default function CollectorInfoSidebar({ snapshot }: Props) {
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>{t('in-infrastructure:collectorView.collectorConfig')}</Collapsible.Header>
      <Collapsible.Content>
        <Info snapshot={snapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
}
