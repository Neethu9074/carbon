import React, { Fragment } from 'react';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesEndpoints from 'in-subscription/kubernetes/getKubernetesEndpoints';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import EntityLink from 'in-new-components/EntityLink';
import WithIcon from 'in-new-components/WithIcon';

const pathSegment = '/endpoints';
const matrixPrefix = 'endpoints.';

export default function Endpoints({ timeConfig, data: service, clusterId, namespaceId }) {
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
            defaultOrderBy="address"
            defaultOrderDirection="ASC"
            defaultPageSize={10}
            withoutPadding={false}
            clusterId={clusterId}
            namespaceId={namespaceId}
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
    id: 'address',
    label: 'Address',
    getContent(item) {
      return <WithIcon icon="lib_kubernetes_endpoint">{get(item, 'address')}</WithIcon>;
    }
  },
  {
    id: 'port',
    label: 'Port',
    getContent(item) {
      return get(item, 'port');
    }
  },
  {
    id: 'portName',
    label: 'Port Name',
    getContent(item) {
      return get(item, 'portName') || valueMissingPlaceholder;
    }
  },
  {
    id: 'protocol',
    label: 'Protocol',
    getContent(item) {
      return get(item, 'protocol');
    }
  },
  {
    id: 'ready',
    label: 'Status',
    getContent(item) {
      return get(item, 'ready') ? 'Ready' : 'Not Ready';
    }
  },
  {
    id: 'podName',
    label: 'Target',
    getContent(item, { namespaceId, clusterId }) {
      return item.podName && item.podSnapshotId ? (
        <EntityLink
          icon="lib_kubernetes_pod"
          label={item.podName}
          href$={getPodDashboard(item.podSnapshotId, { namespaceId, clusterId })}
        />
      ) : (
        valueMissingPlaceholder
      );
    }
  }
];
