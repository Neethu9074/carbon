/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import Catalog from 'in-forge/plugins/ibmApiConnect/Dashboard/CatalogTables';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

interface IbmApiConnectDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmApiConnectDashboard = ({ snapshot, timeConfig }: IbmApiConnectDashboardProps) => {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.numberOfCatalogs')}>
          {data.get('numberOfCatalogs')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.totalProducts')}>
          <MetricValue snapshotId={snapshotId} metric="totalProducts" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.totalApiCalls')}>
          <MetricValue snapshotId={snapshotId} metric="totalApiCalls" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.totalErrors')}>
          <MetricValue snapshotId={snapshotId} metric="totalError" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Catalog snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
};
export default IbmApiConnectDashboard;
