import React, { Fragment } from 'react';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesServices from 'in-subscription/kubernetes/getKubernetesServices';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import { Row, Col } from 'in-new-components/layout/Grid';

const pathSegment = '/endpoints';
const matrixPrefix = 'endpoints.';

export default function Endpoints({ timeConfig, data: service }) {
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <KpiCard title="Type" value={service.type} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Location" value={service.location} />
        </Col>
        <Col lg={4}>
          <KpiCard title="Created" value={service.created} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ServerTableWithUrlBoundState
            cardTitle="Endpoints"
            pathSegment={pathSegment}
            matrixPrefix={matrixPrefix}
            get={getTableData}
            columnDefinitions={columnDefinitions}
            timeConfig={timeConfig}
            serviceId={service.id}
            paginationResettingProps={['serviceId', 'timeConfig']}
            defaultOrderBy="name"
            defaultOrderDirection="ASC"
            defaultPageSize={10}
          />
        </Col>
      </Row>
    </Fragment>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, serviceId }) {
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
      serviceId,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      return get(item, ['endpoint', 'name']);
    }
  },
  {
    id: 'address',
    label: 'Address',
    getContent(item) {
      return get(item, ['endpoint', 'address']);
    }
  },
  {
    id: 'port',
    label: 'Port',
    getContent(item) {
      return get(item, ['endpoint', 'port']);
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(item) {
      return get(item, ['endpoint', 'status']);
    }
  },
  {
    id: 'uid',
    label: 'UID',
    getContent(item) {
      return get(item, ['endpoint', 'uid']);
    }
  }
];
