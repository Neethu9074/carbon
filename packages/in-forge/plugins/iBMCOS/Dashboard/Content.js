/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import BucketsTable from 'in-forge/plugins/iBMCOS/Dashboard/BucketsTable';
import { number, bytes } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function iBMCOSDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.iBMCOS.labelTotalObjectCount')}>
          <MetricValue snapshotId={snapshotId} metric="object_count_total" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.iBMCOS.labelTotalUsed')}>
          <MetricValue snapshotId={snapshotId} metric="used_bytes_total" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <BucketsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
