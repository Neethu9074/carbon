import React, { Fragment } from 'react';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesEndpoints from 'in-subscription/kubernetes/getKubernetesEndpoints';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { Row, Col } from 'in-new-components/layout/Grid';
import WithIcon from 'in-new-components/WithIcon';

const pathSegment = '/endpoints';
const matrixPrefix = 'endpoints.';

export default function Endpoints({ timeConfig, data: service }) {
  return (
    <Fragment>
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
  return getKubernetesEndpoints({
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
    id: 'serviceUid',
    label: 'Service UID',
    getContent(item) {
      return <WithIcon icon="lib_kubernetes_endpoint">{get(item, ['endpoint', 'serviceUid'])}</WithIcon>;
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_pod" count={get(item, ['endpoint', 'pods'])} />;
    }
  },
  {
    id: 'internal',
    label: 'Interal',
    getContent(item) {
      return <EntityCounter count={get(item, ['endpoint', 'internal'])} />;
    }
  },
  {
    id: 'external',
    label: 'External',
    getContent(item) {
      return <EntityCounter count={get(item, ['endpoint', 'external'])} />;
    }
  }
];
