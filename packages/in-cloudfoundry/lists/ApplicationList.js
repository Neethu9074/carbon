import React, { Fragment } from 'react';

import CloudfoundryNoDataNotification from 'in-cloudfoundry/lists/components/CloudfoundryNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import getCloudfoundryApplications from 'in-cloudfoundry/subscriptions/getCloudfoundryApplications';
import { applicationList, getApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import ApplicationState from 'in-cloudfoundry/commonComponents/ApplicationState';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import InstanceMetric from 'in-cloudfoundry/commonComponents/InstanceMetric';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import Tooltip from 'in-components/Tooltip';

import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './ApplicationList.mless';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';

const pathSegment = applicationList;
const matrixPrefix = 'cfApplication.';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <EntityLink label={item.label} href$={getApplicationDashboard(item.id)} icon="lib_cloudfoundry_application" />
      );
    }
  },
  {
    id: 'status',
    label: 'Requested State',
    getContent(item) {
      return <ApplicationState state={item.status} />;
    }
  },
  {
    id: 'instances',
    label: 'Instances',
    getContent(item) {
      return <InstanceMetric applicationId={item.id} />;
    }
  },
  {
    id: 'memoryLimit',
    label: 'Memory Limit',
    sortable: false,
    getContent(item) {
      return <span className={locals.metricLabel}>{bytesZeroDecimalPlaces(item.memoryLimit)}</span>;
    }
  },
  {
    id: 'organization',
    label: 'Organization',
    getContent(item) {
      return item.organization;
    }
  },
  {
    id: 'space',
    label: 'Space',

    getContent(item) {
      return (
        <Tooltip themeStyle="light" content={item.space}>
          <div className={locals.longLabel}>{item.space}</div>
        </Tooltip>
      );
    }
  },
  {
    id: 'routes',
    label: 'Routes',
    getContent(item) {
      const joinedRoutes = item.routes.join(', ') || valueMissingPlaceholder;
      return (
        <Tooltip themeStyle="light" content={joinedRoutes}>
          <div className={locals.longLabel}>{joinedRoutes}</div>
        </Tooltip>
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function ApplicationList({ timeConfig }) {
    return (
      <Fragment>
        <Title title="Cloud Foundry Applications" />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<CloudfoundryNoDataNotification icon="lib_cloudfoundry_application" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getCloudfoundryApplicationsSubscribeEvent(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getCloudfoundryApplicationsSubscribeEvent({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getCloudfoundryApplicationsSubscribeEvent({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig
}) {
  return getCloudfoundryApplications({
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
