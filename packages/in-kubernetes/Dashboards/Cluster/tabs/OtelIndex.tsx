/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';

import {
  beeInstanaInfraMetricsEnabled,
  beeinstanaInfraMetricsWithTimeshiftEnabled,
  openTelemetryKubernetesPodsViewEnabled,
  openTelemetryKubernetesNodesViewEnabled
} from 'in-services/featureFlags';
//@ts-expect-error TS migration
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Cluster/tabs/SummaryWithoutTimeShift';
import { nodesDashboard, podsDashboard, clusterOtelDashboardFullyQualified, clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import OtelNodes from 'in-kubernetes/Dashboards/Cluster/tabs/OtelNodes';
//@ts-expect-error TS migration
import { ClusterTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
//@ts-expect-error TS migration
import Pods from 'in-kubernetes/Dashboards/Cluster/tabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/OtelSummary';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${clusterOtelDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
  },
  openTelemetryKubernetesNodesViewEnabled && {
    label: t('in-kubernetes:dashboards.nodes'),
    path: `${clusterOtelDashboardFullyQualified}${nodesDashboard}`,
   component: (props: { result?: any; tab?: any; location?: any }) => (
  <OtelNodes {...props} data={props.result?.data ?? {}} />
),
    header: (props: { result: any; tab: any; location: any }) => getCounterComponent(props, v => v.nodes)
  },
  openTelemetryKubernetesPodsViewEnabled && {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${clusterDashboardFullyQualified}${podsDashboard}`,
    component: Pods,
    header: ({ result, tab, location }: { result: any; tab: any; location: any }) =>
      getCounterComponent({ result, tab, location }, v => v.workloads.pods),
    stickToBottom: true
  }
].filter(Boolean);

function getCounterComponent(
  { result, tab, location }: { result: any; tab: any; location: any },
  valueExtractor: (v: any) => number
) {
  const clusterId = result?.data?.id;
  const timeConfig = getTimeConfig(location);
  return <ClusterTab clusterId={clusterId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />;
}
