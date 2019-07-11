import { get } from 'lodash';
import React from 'react';

import createServerTableWithEmptyState from 'in-components/tables/ServerTable/ServerTableWithEmptyState';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ViewWidthRestrictedColumn from 'in-components/Table/components/ViewWidthRestrictedColumn';
import { plugins, translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getKubernetesEvents from 'in-subscription/kubernetes/getKubernetesEvents';
import { getDashboardForEntity } from 'in-kubernetes/navigation/paths';
import DateTime from 'in-components/tables/sharedComponents/DateTime';
import EntityLink from 'in-new-components/EntityLink';
import { getIconByPlugin } from 'in-kubernetes/icons';
import Tooltip from 'in-components/Tooltip';

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
      const isLinkableEntity =
        [clusterId, deploymentId, deploymentConfigId, namespaceId, serviceId, podId].indexOf(item.sourceId) === -1 &&
        translateFullyQualifiedPluginToShortPluginName(item.sourcePlugin) !== plugins.kubernetesReplicaSet;

      if (isLinkableEntity) {
        return (
          <EntityLink
            icon={getIconByPlugin(translateFullyQualifiedPluginToShortPluginName(item.sourcePlugin))}
            label={item.name}
            href$={getDashboardForEntity(item.sourceId, item.sourcePlugin)}
          />
        );
      }

      return item.name;
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
  const ServerTableWithUrlState = createServerTableWithEmptyState({
    ServerTable: createServerTableWithUrlState({
      paginationResettingUrlParameters: [...timeConfigUrlParameters],
      columnDefinitions,
      defaultOrderBy: 'time',
      defaultOrderDirection: 'DESC',
      defaultPageSize: 10,
      pathSegment,
      matrixPrefix
    }),
    columnDefinitions
  });

  return function Events({ clusterId, deploymentId, deploymentConfigId, namespaceId, podId, serviceId, ...props }) {
    return (
      <ServerTableWithUrlState
        clusterId={clusterId}
        deploymentId={deploymentId}
        deploymentConfigId={deploymentConfigId}
        namespaceId={namespaceId}
        podId={podId}
        serviceId={serviceId}
        get={getTableData}
        {...props}
      />
    );
  };
}

export default eventsTable(allColumns);

export const EventsWithoutNamespace = eventsTable(columnsWithoutNamespace);

function getTableData({
  query = '',
  page = 1,
  pageSize = 10,
  orderBy = 'time',
  orderDirection = 'DESC',
  clusterId,
  deploymentId,
  deploymentConfigId,
  namespaceId,
  serviceId,
  podId,
  timeConfig,
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
