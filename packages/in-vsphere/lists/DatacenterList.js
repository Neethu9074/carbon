import React, { Fragment } from 'react';

import VSphereNoDataNotification from 'in-vsphere/lists/components/VSphereNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getVSphereDatacenters from 'in-vsphere/subscriptions/getVsphereDatacenters';
import { datacenterList, getVSphereDatacenterDashboard } from 'in-vsphere/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

const pathSegment = datacenterList;
const matrixPrefix = 'datacenter.';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <EntityLink
          label={item.label}
          href$={getVSphereDatacenterDashboard(item.id)}
          icon="lib_cloudfoundry_application"
        />
      );
    }
  },
  {
    id: 'hosts',
    label: 'vSphere Hosts',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_node" count={item.namespaces} />;
    }
  },
  {
    id: 'vms',
    label: 'Virtual Machines',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_node" count={item.services} />;
    }
  },
  {
    id: 'health',
    label: 'Health',
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.cluster.id}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function DatacenterList({ timeConfig }) {
    return (
      <Fragment>
        <Title title="Datacenters" />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<VSphereNoDataNotification icon="lib_cloudfoundry_application" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getVSphereDatacentersSubscribeEvent(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getVSphereDatacentersSubscribeEvent({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getVSphereDatacentersSubscribeEvent({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}) {
  return getVSphereDatacenters({
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
      timeConfig
    }
  });
}
