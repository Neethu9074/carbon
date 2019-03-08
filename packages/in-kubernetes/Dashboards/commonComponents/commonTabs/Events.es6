import React, { Fragment } from 'react';
import { get } from 'lodash';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getKubernetesEvents from 'in-subscription/kubernetes/getKubernetesEvents';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import EntityLink from 'in-new-components/EntityLink';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import { getDashboardForEntity } from 'in-kubernetes/navigation/paths';

const iconsByPlugin = {
  'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.pod.KubernetesPod': 'lib_kubernetes_pod',
  'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.service.KubernetesService': 'lib_kubernetes_service',
  'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.deployment.KubernetesDeployment':
    'lib_kubernetes_workload',
  'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.namespace.KubernetesNamespace':
    'lib_kuberetes_namespace',
  'com.instana.forge.infrastructure.paas.kubernetes.KubernetesCluster': 'lib_kubernetes_cluster'
};

const columnDefinitions = [
  {
    id: 'title',
    label: 'Event',
    getContent(item) {
      return <EntityWithTypeAndIcon label={get(item, 'detailText')} type={get(item, 'title')} />;
    }
  },
  {
    id: 'entityLabel',
    label: 'Source',
    getContent(item) {
      return (
        <EntityLink
          icon={iconsByPlugin[item.sourcePlugin]}
          label={item.entityLabel}
          href$={getDashboardForEntity(item.sourceId, item.sourcePlugin)}
        />
      );
    }
  },
  {
    id: 'time',
    label: 'Time',
    getContent(item) {
      return formatDateTime(get(item, 'time'));
    }
  }
];

const pathSegment = '/events';
const matrixPrefix = 'events.';

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'time',
  defaultOrderDirection: 'DESC',
  defaultPageSize: 10,
  pathSegment,
  matrixPrefix
});

export default function Events({ serviceId, namespaceId, clusterId, podId, ...props }) {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <ServerTableWithUrlState
            cardTitle="Events"
            serviceId={serviceId}
            namespaceId={namespaceId}
            clusterId={clusterId}
            podId={podId}
            get={getTableData}
            {...props}
          />
        </Col>
      </Row>
    </Fragment>
  );
}

function getTableData({
  serviceId,
  namespaceId,
  clusterId,
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
      serviceId,
      namespaceId,
      clusterId,
      podId,
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
