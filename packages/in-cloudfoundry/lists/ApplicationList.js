/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getCloudfoundryApplicationsWithDefaults } from 'in-cloudfoundry/subscriptions/getCloudfoundryApplications';
import CloudfoundryNoDataNotification from 'in-cloudfoundry/lists/components/CloudfoundryNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import { applicationList, getApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import ApplicationState from 'in-cloudfoundry/commonComponents/ApplicationState';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import InstanceMetric from 'in-cloudfoundry/commonComponents/InstanceMetric';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { timeConfig$ } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './ApplicationList.mless';

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
    id: 'foundation',
    label: 'Foundation',
    getContent(item) {
      return item.foundation != null ? item.foundation : valueMissingPlaceholder;
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
          snapshotId={item.id}
          inContentArea
        />
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
      <>
        <Title title="Cloud Foundry Applications" />
        <ViewTrackingMeta
          data={{
            productArea: 'Cloud Foundry',
            pageRootName: 'CF Applications'
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<CloudfoundryNoDataNotification icon="lib_cloudfoundry_application" />}
        >
          <Card>
            <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
          </Card>
        </WithEmptyStateFallback>
      </>
    );
  }
);

function getTableData(params) {
  return getCloudfoundryApplicationsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getCloudfoundryApplicationsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
