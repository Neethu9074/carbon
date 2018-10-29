import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import getKubernetesServices from 'in-subscription/kubernetes/getKubernetesServices';
import { serviceList, getServiceDashboard } from 'in-kubernetes/navigation/paths';
import ListTitle from 'in-new-components/lists/Title';
import { timeConfig$ } from 'in-stores/time/config';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';

const matrixPrefix = 'k8Service.';

export default compose(connect({ timeConfig: timeConfig$ }))(ServiceList);

function ServiceList({ timeConfig }) {
  const leftHeader = <ListTitle>Services</ListTitle>;

  return (
    <Fragment>
      <Title title="Services" />

      <ServerTableWithUrlBoundState
        get={getTableData}
        pathSegment={serviceList}
        matrixPrefix={matrixPrefix}
        columnDefinitions={columnDefinitions}
        timeConfig={timeConfig}
        paginationResettingProps={['timeConfig']}
        leftHeader={leftHeader}
        defaultOrderBy="label"
        defaultOrderDirection="DESC"
        defaultPageSize={20}
      />
    </Fragment>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig }) {
  return getKubernetesServices({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {},
    filter: {
      label: query,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_kubernetes_service"
          label={item.name}
          href$={getServiceDashboard(item.id)}
        />
      );
    }
  },
  {
    id: 'selector',
    label: 'Selector',
    getContent(item) {
      return item.selector;
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent() {
      return 'foo';
    }
  },
  {
    id: 'maxSeverity',
    label: 'Health',
    defaultOrderDirection: 'DESC',
    getContent() {
      return 42;
    }
  }
];
