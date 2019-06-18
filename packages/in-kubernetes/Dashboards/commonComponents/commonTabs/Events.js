import { get, includes } from 'lodash';
import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ViewWidthRestrictedColumn from 'in-components/Table/components/ViewWidthRestrictedColumn';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getKubernetesEvents from 'in-subscription/kubernetes/getKubernetesEvents';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getDashboardForEntity } from 'in-kubernetes/navigation/paths';
import DateTime from 'in-components/tables/sharedComponents/DateTime';
import { fullyQualifiedPlugins } from 'in-forge/constants';
import { Row, Col } from 'in-new-components/layout/Grid';
import EntityLink from 'in-new-components/EntityLink';
import Tooltip from 'in-components/Tooltip';

const pluginIcons = {
  [fullyQualifiedPlugins.kubernetesPod]: 'lib_kubernetes_pod',
  [fullyQualifiedPlugins.kubernetesService]: 'lib_kubernetes_service',
  [fullyQualifiedPlugins.kubernetesDeployment]: 'lib_kubernetes_workload',
  [fullyQualifiedPlugins.openshiftDeploymentConfig]: 'lib_kubernetes_workload',
  [fullyQualifiedPlugins.kubernetesNamespace]: 'lib_kuberetes_namespace',
  [fullyQualifiedPlugins.kubernetesReplicaSet]: 'lib_kubernetes_workload',
  [fullyQualifiedPlugins.kubernetesCluster]: 'lib_kubernetes_cluster'
};

const allColumns = [
  {
    id: 'type',
    label: 'Type',
    getContent(item) {
      return get(item, 'type') || valueMissingPlaceholder;
    }
  },
  {
    id: 'title',
    label: 'Reason',
    getContent(item) {
      return get(item, 'title');
    }
  },
  {
    id: 'detailText',
    label: 'Message',
    getContent(item) {
      return (
        <Tooltip themeStyle="light" content={get(item, 'detailText')} align="topMiddle">
          <ViewWidthRestrictedColumn width={20}>{get(item, 'detailText')}</ViewWidthRestrictedColumn>
        </Tooltip>
      );
    }
  },
  {
    id: 'namespace',
    label: 'Namespace',
    getContent(item) {
      return item.namespace || valueMissingPlaceholder;
    }
  },
  {
    id: 'name',
    label: 'Involved Object',
    getContent(item, { clusterId, deploymentId, deploymentConfigId, namespaceId, serviceId, podId }) {
      const href$ = includes(
        [clusterId, deploymentId, deploymentConfigId, namespaceId, serviceId, podId],
        item.sourceId
      )
        ? null
        : getDashboardForEntity(item.sourceId, item.sourcePlugin);
      return <EntityLink icon={pluginIcons[item.sourcePlugin]} label={item.name} href$={href$} />;
    }
  },
  {
    id: 'kind',
    label: 'Kind',
    getContent(item) {
      return item.kind || valueMissingPlaceholder;
    }
  },
  {
    id: 'time',
    label: 'Time',
    getContent(item) {
      return <DateTime>{get(item, 'time')}</DateTime>;
    }
  }
];

const columnsWithoutNamespace = allColumns.filter(c => c.id !== 'namespace');

const pathSegment = '/events';
const matrixPrefix = 'events.';

function eventsTable(columnDefinitions) {
  const ServerTableWithUrlState = createServerTableWithUrlState({
    paginationResettingUrlParameters: [...timeConfigUrlParameters],
    columnDefinitions,
    defaultOrderBy: 'time',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 10,
    pathSegment,
    matrixPrefix
  });

  return function Events({ clusterId, deploymentId, deploymentConfigId, namespaceId, podId, serviceId, ...props }) {
    return (
      <Row>
        <Col lg={12}>
          <ServerTableWithUrlState
            cardTitle="Events"
            clusterId={clusterId}
            deploymentId={deploymentId}
            deploymentConfigId={deploymentConfigId}
            namespaceId={namespaceId}
            podId={podId}
            serviceId={serviceId}
            get={getTableData}
            {...props}
          />
        </Col>
      </Row>
    );
  };
}

export default eventsTable(allColumns);

export const EventsWithoutNamespace = eventsTable(columnsWithoutNamespace);

function getTableData({
  clusterId,
  deploymentId,
  deploymentConfigId,
  namespaceId,
  serviceId,
  podId,
  page,
  pageSize,
  orderBy,
  orderDirection,
  timeConfig,
  query,
  resultTransformer = result => result
}) {
  return getKubernetesEvents({
    filter: {
      clusterId,
      deploymentId,
      deploymentConfigId,
      namespaceId,
      podId,
      serviceId,
      timeConfig
    },
    query,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    }
  }).map(resultTransformer);
}
