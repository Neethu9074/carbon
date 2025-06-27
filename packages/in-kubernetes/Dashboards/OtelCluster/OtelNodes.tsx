/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import type { KubernetesNode, EntityHealthInfo, TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

// @ts-expect-error TS migration
import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
// @ts-expect-error TS migration
import ViewWidthRestrictedColumn from 'in-infrastructure/tableView/components/Table/components/ViewWidthRestrictedColumn';
// @ts-expect-error TS migration
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
// @ts-expect-error TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error TS migration
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
// @ts-expect-error TS migration
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error TS migration
import { formatDurationAccurately } from 'in-kubernetes/components/TimeFormatter';
import { clusterIdUrlParameter, daemonSetIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getOtelKubernetesNodesData } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
// @ts-expect-error TS migration
import { isEks } from 'in-kubernetes/clusterDistributions';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
// @ts-expect-error TS migration
import { getLabel } from 'in-sdk/snapshot';
import { useOtelNodeDashboard } from 'in-kubernetes/navigation/paths';
import { t } from 'in-i18n';

const pathSegment = '/otel/nodes';
const matrixPrefix = 'node.';

export interface OtelNodeTableItem {
  node: KubernetesNode;
  name: string;
  entityHealthInfo: EntityHealthInfo;
  age?: number;
  roles?: string;
  status?: string;
  sortedMetricValue?: number;
  snapshotIdForMetric?: string;
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item: OtelNodeTableItem) {
      const { node, name, entityHealthInfo } = item;
      return <NodeLink id={node.id} name={name} entityHealthInfo={entityHealthInfo} />;
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
    getContent(item: OtelNodeTableItem, timeConfig: TimeConfig) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.node.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-kubernetes:dashboards.noDataAvailable.nodesTitle'),
    description: t('in-kubernetes:dashboards.noDataAvailable.nodesDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter, daemonSetIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Nodes(props: any) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="nodes" />
      <Card>
        <ServerTableWithUrlState get={getOtelKubernetesNodesData} {...props} />
      </Card>
    </>
  );
}

type NodeLinkProps = {
  id: string;
  name: string;
  entityHealthInfo: {
    maxSeverity: number;
    openIssues?: any[];
    [key: string]: any;
  };
};

function NodeLink({ id, name, entityHealthInfo }: NodeLinkProps) {
  const href = useOtelNodeDashboard(id);

  return (
    <SeverityAwareEntityLink
      icon="lib_kubernetes_node"
      label={name}
      href={href}
      severity={entityHealthInfo.maxSeverity}
    />
  );
}
