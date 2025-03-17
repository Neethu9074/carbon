/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card, TableEntityCounter } from '@instana/components';

import {
  clusterIdUrlParameter,
  namespaceIdUrlParameter,
  daemonSetIdUrlParameter,
  deploymentIdUrlParameter,
  deploymentConfigIdUrlParameter,
  statefulSetIdUrlParameter
} from 'in-kubernetes/navigation/urlParameters';
import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getKubernetesServices from 'in-kubernetes/subscriptions/getKubernetesServices';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { formatDurationAccurately } from 'in-kubernetes/components/TimeFormatter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useServiceDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-components/EntityLink';
import { t } from 'in-i18n';

const pathSegment = '/services';
const matrixPrefix = 'service.';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item) {
      const { id, name } = item;

      return <ServiceLink id={id} name={name} />;
    }
  },
  {
    id: 'namespace',
    label: t('in-kubernetes:dashboards.namespace'),
    getContent(item) {
      return item.namespace;
    }
  },
  {
    id: 'type',
    label: t('in-kubernetes:dashboards.type'),
    getContent(item) {
      return item.type;
    }
  },
  {
    id: 'location',
    label: t('in-kubernetes:dashboards.serviceLocation'),
    getContent(item) {
      return item.location;
    }
  },
  {
    id: 'internalEndpoints',
    label: t('in-kubernetes:dashboards.intEndpoints'),
    getContent(item) {
      return item.internalEndpoints;
    }
  },
  {
    id: 'externalEndpoints',
    label: t('in-kubernetes:dashboards.extEndpoints'),
    getContent(item) {
      return item.externalEndpoints;
    }
  },
  {
    id: 'pods',
    label: t('in-kubernetes:dashboards.pods'),
    getContent(item) {
      return <TableEntityCounter icon="lib_kubernetes_pod" count={item.pods} />;
    }
  },
  {
    id: 'age',
    label: t('in-kubernetes:dashboards.age'),
    getContent(item) {
      return formatDurationAccurately(item.age);
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
          snapshotId={item.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-kubernetes:dashboards.noDataAvailable.servicesTitle'),
    description: t('in-kubernetes:dashboards.noDataAvailable.servicesDescription')
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    clusterIdUrlParameter,
    namespaceIdUrlParameter,
    daemonSetIdUrlParameter,
    deploymentIdUrlParameter,
    deploymentConfigIdUrlParameter,
    statefulSetIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'health',
  defaultOrderDirection: 'DESC',
  pathSegment,
  matrixPrefix
});

export default function ServiceTable(props) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="services" />
      <Card>
        <ServerTableWithUrlState get={getTableData} {...props} />
      </Card>
    </>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'health',
  orderDirection = 'DESC',
  timeConfig,
  namespaceId,
  clusterId,
  workloadControllerId,
  resultTransformer = result => result
}) {
  return getKubernetesServices({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      namespaceId,
      clusterId,
      workloadControllerId,
      timeConfig
    }
  }).map(resultTransformer);
}

function ServiceLink({ id, name }) {
  const href = useServiceDashboard(id);
  return <EntityLink icon="lib_kubernetes_service" label={name} href={href} />;
}
