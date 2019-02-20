import React, { Fragment } from 'react';
import { get } from 'lodash';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getKubernetesEvents from 'in-subscription/kubernetes/getKubernetesEvents';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';

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
      return get(item, 'entityLabel');
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
