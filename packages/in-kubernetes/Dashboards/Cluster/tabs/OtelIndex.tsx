/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';

import { Result, KubernetesClusterListItem } from '@instana/types';

import {
  beeInstanaInfraMetricsEnabled,
  beeinstanaInfraMetricsWithTimeshiftEnabled,
  openTelemetryKubernetesUnifiedViewEnabled
} from 'in-services/featureFlags';
//@ts-expect-error TS migration
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Cluster/tabs/SummaryWithoutTimeShift';
import { nodesDashboard, podsDashboard, clusterOtelDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
//@ts-expect-error TS migration
import { ClusterTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import OtelNodes from 'in-kubernetes/Dashboards/Cluster/tabs/OtelNodes';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/OtelSummary';
import OtelPods from 'in-kubernetes/Dashboards/Cluster/tabs/OtelPods';
import { getTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

interface DashboardTab {
  label: string;
  path: string;
  component: (props: any) => JSX.Element;
  header?: (props: any) => JSX.Element;
  [key: string]: unknown;
}

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${clusterOtelDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
  },
  openTelemetryKubernetesUnifiedViewEnabled && {
    label: t('in-kubernetes:dashboards.nodes'),
    path: `${clusterOtelDashboardFullyQualified}${nodesDashboard}`,
    component: (props: { result?: Result<KubernetesClusterListItem>; tab?: DashboardTab; location?: Location }) => (
      <OtelNodes {...props} data={props.result?.data ?? {}} />
    ),
    header: (props: { result: Result<KubernetesClusterListItem>; tab: DashboardTab; location: Location }) =>
      getCounterComponent(props, v => v.nodes)
  },
  openTelemetryKubernetesUnifiedViewEnabled && {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${clusterOtelDashboardFullyQualified}${podsDashboard}`,
    component: (props: { result?: Result<KubernetesClusterListItem>; tab?: DashboardTab; location?: Location }) => (
      props.location ? <OtelPods {...props} data={props.result?.data ?? {}} timeConfig={getTimeConfig(props.location)}/> : null
    ),
    header: (props: { result: Result< KubernetesClusterListItem >; tab: DashboardTab; location: Location }) =>
      getCounterComponent(props, v => v.pods)
  }
].filter(Boolean);

function getCounterComponent(
  { result, tab, location }: { result: Result<KubernetesClusterListItem>; tab: DashboardTab; location: Location },
  valueExtractor: (v: any) => number
) {
  const clusterId = result?.data?.id;
  const timeConfig = getTimeConfig(location);
  return <ClusterTab clusterId={clusterId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />;
}
