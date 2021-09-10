/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Card, TableDateTime } from '@instana/components';

import ViewWidthRestrictedColumn from 'in-infrastructure/tableView/components/Table/components/ViewWidthRestrictedColumn';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { plugins, translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getKubernetesEvents from 'in-kubernetes/subscriptions/getKubernetesEvents';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import { getDashboardForEntity } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-components/EntityLink';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

const allColumns = [
  {
    id: 'type',
    label: t('in-kubernetes:dashboards.type'),
    getContent(item) {
      return get(item, 'type') || valueMissingPlaceholder;
    }
  },
  {
    id: 'title',
    label: t('in-kubernetes:dashboards.reason'),
    getContent(item) {
      return get(item, 'title');
    }
  },
  {
    id: 'detailText',
    label: t('in-kubernetes:dashboards.message'),
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
    label: t('in-kubernetes:dashboards.namespace'),
    getContent(item) {
      return item.namespace || valueMissingPlaceholder;
    }
  },
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.involvedObject'),
    getContent(
      item,
      { clusterId, daemonSetId, deploymentId, deploymentConfigId, namespaceId, serviceId, statefulSetId, podId }
    ) {
      const plugin = translateFullyQualifiedPluginToShortPluginName(item.sourcePlugin);
      const isLinkableEntity =
        plugin &&
        [
          clusterId,
          daemonSetId,
          deploymentId,
          deploymentConfigId,
          namespaceId,
          serviceId,
          statefulSetId,
          podId
        ].indexOf(item.sourceId) === -1 &&
        plugin !== plugins.kubernetesReplicaSet;

      if (isLinkableEntity) {
        return (
          <EntityLink
            icon={getIconType(plugin)}
            label={item.name}
            href$={getDashboardForEntity(item.sourceId, plugin)}
          />
        );
      }

      return item.name;
    }
  },
  {
    id: 'kind',
    label: t('in-kubernetes:dashboards.kind'),
    getContent(item) {
      return item.kind || valueMissingPlaceholder;
    }
  },
  {
    id: 'time',
    label: t('in-kubernetes:dashboards.time'),
    getContent(item) {
      return <TableDateTime>{get(item, 'time')}</TableDateTime>;
    }
  }
];

const columnsWithoutNamespace = allColumns.filter(c => c.id !== 'namespace');

const pathSegment = '/events';
const matrixPrefix = 'events.';

function eventsTable(columnDefinitions) {
  const ServerTableWithUrlState = createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions,
      title: t('in-kubernetes:dashboards.noDataAvailable.eventsTitle'),
      description: t('in-kubernetes:dashboards.noDataAvailable.eventsDescription')
    }),
    paginationResettingUrlParameters: [...timeConfigUrlParameters],
    columnDefinitions,
    defaultOrderBy: 'time',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 10,
    pathSegment,
    matrixPrefix
  });

  return function Events({
    clusterId,
    daemonSetId,
    deploymentId,
    deploymentConfigId,
    namespaceId,
    podId,
    serviceId,
    statefulSetId,
    ...props
  }) {
    return (
      <Card>
        <ServerTableWithUrlState
          clusterId={clusterId}
          daemonSetId={daemonSetId}
          deploymentId={deploymentId}
          deploymentConfigId={deploymentConfigId}
          namespaceId={namespaceId}
          podId={podId}
          serviceId={serviceId}
          statefulSetId={statefulSetId}
          get={getTableData}
          {...props}
        />
      </Card>
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
  daemonSetId,
  deploymentId,
  deploymentConfigId,
  namespaceId,
  serviceId,
  statefulSetId,
  podId,
  timeConfig,
  resultTransformer = result => result
}) {
  return getKubernetesEvents({
    filter: {
      clusterId,
      daemonSetId,
      deploymentId,
      deploymentConfigId,
      namespaceId,
      podId,
      serviceId,
      statefulSetId,
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
