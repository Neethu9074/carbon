import React, { Fragment } from 'react';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesEvents from 'in-subscription/kubernetes/getKubernetesEvents';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';

const pathSegment = '/events';
const matrixPrefix = 'events.';

export default function Events({ data: service, ...props }) {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <ServerTableWithUrlBoundState
            cardTitle="Events"
            serviceId={service.id}
            pathSegment={pathSegment}
            matrixPrefix={matrixPrefix}
            get={getTableData}
            columnDefinitions={columnDefinitions}
            paginationResettingProps={['serviceId', 'timeConfig']}
            defaultOrderBy="time"
            defaultOrderDirection="DESC"
            defaultPageSize={10}
            {...props}
          />
        </Col>
      </Row>
    </Fragment>
  );
}

function getTableData({
  serviceId,
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

const columnDefinitions = [
  {
    id: 'time',
    label: 'Time',
    getContent(item) {
      return formatDateTime(get(item, 'time'));
    }
  },
  {
    id: 'entityLabel',
    label: 'On',
    getContent(item) {
      return get(item, 'entityLabel');
    }
  },
  {
    id: 'title',
    label: 'Title',
    getContent(item) {
      return get(item, 'title');
    }
  },
  {
    id: 'details',
    label: 'Details',
    getContent(item) {
      return get(item, 'detailText');
    }
  }
];
