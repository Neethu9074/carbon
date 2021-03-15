/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

export default function ClusterSummary({ snapshot }) {
  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.hazelcastCluster.isClusterSafe')}>
        {yesOrNo(snapshot.getIn(['data', 'isClusterSafe']))}
      </KpiKeyValue>
    </KpiSection>
  );
}
