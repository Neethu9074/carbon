/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import { number, bytes } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ibmcloudObjectStorageDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudObjectStorage.totalObjectCount')}>
          <MetricValue snapshotId={snapshotId} metric="object_count_total" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudObjectStorage.totalUsedBytes')}>
          <MetricValue snapshotId={snapshotId} metric="used_bytes_total" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>
    </div>
  );
}
