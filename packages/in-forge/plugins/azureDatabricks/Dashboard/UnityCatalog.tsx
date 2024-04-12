/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection/DashboardSection';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import UnityCatalogSummary from './UnityCatalogSummary';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import PopularAssetsTable from './PopularAssetsTable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import UnAuthOpsTable from './UnAuthOpsTable';
import CatalogsTable from './CatalogsTable';
import { NOT_AVAILABLE } from '../Info';
import { t } from 'in-i18n';

export default function UnityCatalog({
  snapshot,
  configuredLogAnalytics
}: {
  snapshot: SnapshotData;
  configuredLogAnalytics: string;
}) {
  const snapshotId = snapshot.get('id');
  const timeConfig = useTimeConfig();
  const metastore = snapshot.getIn(['data', 'unityCatalog.metastore'], NOT_AVAILABLE);

  if (metastore == NOT_AVAILABLE) {
    return null;
  }

  return (
    <DashboardSection title={t('in-forge:plugins.azureDatabricks.titleUnityCatalog')}>
      <UnityCatalogSummary snapshotId={snapshotId} />
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureDatabricks.titleTablesByType')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: snapshot
                .getIn(['data', 'unityCatalog.tableTypes'], emptyList)
                .toArray()
                .map((tableType: string) => 'unityCatalog.tablesByType.' + tableType),
              labels: snapshot.getIn(['data', 'unityCatalog.tableTypes'], emptyList).toArray(),
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureDatabricks.titleVolumesByType')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: snapshot
                .getIn(['data', 'unityCatalog.volumeTypes'], emptyList)
                .toArray()
                .map((tableType: string) => 'unityCatalog.volumesByType.' + tableType),
              labels: snapshot.getIn(['data', 'unityCatalog.volumeTypes'], emptyList).toArray(),
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <CatalogsTable snapshot={snapshot} />
      <PopularAssetsTable snapshot={snapshot} configuredLogAnalytics={configuredLogAnalytics} />
      <UnAuthOpsTable snapshot={snapshot} configuredLogAnalytics={configuredLogAnalytics} />
    </DashboardSection>
  );
}
