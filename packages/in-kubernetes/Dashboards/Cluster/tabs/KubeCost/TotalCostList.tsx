/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';
import { Li } from '@instana/components';

// @ts-expect-error needs TS migration
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn/CenterAlignmentColumn';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface NameSpaceStatsProps {
  currencyCode: string;
  snapshotId: string;
  timeConfig: TimeConfig;
}

export default function Summary({ currencyCode, snapshotId, timeConfig }: NameSpaceStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'namespaceCostGraph'), [snapshotId]);

  if (!data) {
    return getSpecificErrorNotification('Kubecost is not retrieving data');
  }
  const namespaceData = (data as SnapshotData).get('raw_payload', []);

  if (!namespaceData) {
    return getSpecificErrorNotification('Kubecost is not retrieving namespaces information');
  }

  let metricArr: string[] = [];
  let labelArr: string[] = [];

  namespaceData
    .keySeq()
    .toArray()
    .map((key: string) => {
      metricArr.push(`namespaceCostGraph.${key}.totalCost`);
      labelArr.push(key);
    });

  return (
    <>
      <DashboardSection title={t('in-kubernetes:dashboards.kubecost.totalCost')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['namespaceCostList.Total.totalCost'],
            labels: [t('in-kubernetes:dashboards.kubecost.totalCost')],
            type: 'line',
            formatter: (d: number) => `${currencyCode} ${twoDecimalPlaces(d)}`
          }}
          customHeight={300}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-kubernetes:dashboards.kubecost.costByNameSpace')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: metricArr,
            labels: labelArr,
            type: 'stackedBar',
            formatter: (d: number) => `${currencyCode} ${twoDecimalPlaces(d)}`
          }}
          customHeight={300}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </>
  );
}

function getSpecificErrorNotification(value: string) {
  return (
    <Li>
      <CenterAlignmentColumn>
        <EntityPageMainNotification
          icon="lib_missing_data"
          title={value}
          explanation={() => t('in-kubernetes:dashboards.kubecost.noKubecostData')}
        />
      </CenterAlignmentColumn>
    </Li>
  );
}
