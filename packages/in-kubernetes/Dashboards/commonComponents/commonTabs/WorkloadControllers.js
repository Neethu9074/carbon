/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { Card } from '@instana/components';

import {
  clusterIdUrlParameter,
  serviceIdUrlParameter,
  namespaceIdUrlParameter,
  deploymentIdUrlParameter
} from 'in-kubernetes/navigation/urlParameters';
import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { timeByMillisTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { getWorkloadData } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getIcon } from 'in-kubernetes/utils';
import { t } from 'in-i18n';

const msFormatter = d => (d < 0 ? t('in-kubernetes:dashboards.noActivity') : timeByMillisTwoDecimalPlaces(d));
const matrixPrefix = 'deployment.';

function WorkloadLink({ item, getWorkloadControllerDashboard, clusterId }) {
  const href = getWorkloadControllerDashboard(get(item, ['workloadController', 'id']), { clusterId });
  const label = get(item, ['workloadController', 'name']);
  const workloadType = get(item, ['entityIdForMetric', 'pluginId']);
  const icon = getIcon(workloadType);
  return <SeverityAwareEntityLink icon={icon} label={label} href={href} severity={item.entityHealthInfo.maxSeverity} />;
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item, { clusterId, getWorkloadControllerDashboard }) {
      return (
        <WorkloadLink
          getWorkloadControllerDashboard={getWorkloadControllerDashboard}
          clusterId={clusterId}
          item={item}
        />
      );
    }
  },
  {
    id: 'namespace',
    label: t('in-kubernetes:dashboards.namespace'),
    getContent(item) {
      return get(item, ['workloadController', 'namespace']);
    }
  },
  {
    id: 'availableReplicas',
    label: t('in-kubernetes:dashboards.podsOnline'),
    optional: true,
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.snapshotIdForMetric}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={zeroDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'desiredReplicas',
    label: t('in-kubernetes:dashboards.podsDesired'),
    optional: true,
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.snapshotIdForMetric}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={zeroDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'duration',
    label: t('in-kubernetes:dashboards.lastPendingPhaseDuration'),
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['workloadController', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={msFormatter}
        />
      );
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={get(item, ['workloadController', 'id'])}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    clusterIdUrlParameter,
    serviceIdUrlParameter,
    namespaceIdUrlParameter,
    deploymentIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'health',
  defaultOrderDirection: 'DESC',
  matrixPrefix
});

export default function WorkloadControllersTable(props) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} />
      <Card>
        <ServerTableWithUrlState
          get={getWorkloadData}
          filterColumnDefinitions={() => {
            const shouldShowDurationColumn =
              props.workloadControllerType === 'deployment' || props.workloadControllerType === 'deploymentConfig';
            return columnDefinition => shouldShowDurationColumn || columnDefinition.id !== 'duration';
          }}
          {...props}
        />
      </Card>
    </>
  );
}
