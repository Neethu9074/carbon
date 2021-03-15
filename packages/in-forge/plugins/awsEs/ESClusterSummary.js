/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { withSiPrefixZeroDecimalPlaces, bytes } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ESClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.awsEs.labelNodes')}>
        <MetricValue snapshotId={snapshotId} metric="nodes" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.awsEs.titleDocuments')}>
        <MetricValue snapshotId={snapshotId} metric="searchable_documents" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.awsEs.labelFreeStorageSpace')}>
        <MetricValue snapshotId={snapshotId} metric="free_storage_space" formatter={bytes.detailed} />
      </KpiKeyValue>
    </KpiSection>
  );
}
