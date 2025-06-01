/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Capitalize from 'in-components/Capitalize';
import { t } from 'in-i18n';

export interface SummaryData {
  timeConfig: TimeConfig;
  data: SnapshotData;
}

export default function Summary({ data: vm }: SummaryData) {
  return (
    <>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.macAddress')}>
          <Capitalize>{vm.macAddress}</Capitalize>
        </KpiCard>
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.ramAssigned')} value={vm.memoryAssigned} />
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.status')} value={vm.status} />
        <KpiCard title={t('in-windowshypervisor:dashboards.vm.state')} value={vm.state} />
      </KpiGridRow>
    </>
  );
}
