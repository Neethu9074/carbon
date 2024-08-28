/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import getInstanceRelatedResourcesLists from 'in-sap/subscriptions/getInstanceRelatedResourceLists';
import { getHumanReadablePluginName } from 'in-sap/Dashboards/tables/getHumanReadablePluginName';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { GetSpecificDashboard } from 'in-sap/Dashboards/tables/getDashboardSpecifics';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { t } from 'in-i18n';

const pathSegment = '/dbtenant';
const matrixPrefix = 'sapdbtenant.';
var systemSnapshotId = '';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-sap:name'),
    getContent(item) {
      return <GetSpecificDashboard value={item} matrixPrefix={matrixPrefix} systemSnapshotId={systemSnapshotId} />;
    }
  },
  {
    id: 'objectType',
    label: t('in-sap:objectType'),
    getContent(item) {
      return getHumanReadablePluginName(item);
    }
  },
  {
    id: 'hostName',
    label: t('in-sap:hostName'),
    getContent(item) {
      return item.hostName;
    }
  },
  {
    id: 'overallRating',
    label: t('in-sap:dashboards.overallRating'),
    getContent(item) {
      return <Badge color={colorFormatter(item.overallRating)}>{getOverallStatus(item.overallRating)}</Badge>;
    }
  },
  {
    id: 'issues',
    label: t('in-sap:issues'),
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

export default function RelatedResources(props) {
  systemSnapshotId = props.hostId;
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} hostId={systemSnapshotId} />;
}

function getTableData({ page = 1, pageSize = 20, orderBy = 'label', orderDirection = 'ASC', timeConfig, hostId }) {
  return getInstanceRelatedResourcesLists({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      hostId,
      timeConfig
    }
  });
}
