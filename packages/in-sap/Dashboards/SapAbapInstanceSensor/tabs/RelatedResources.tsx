/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error needs TS migration
import { getHumanReadablePluginName } from 'in-sap/Dashboards/tables/getHumanReadablePluginName';
// @ts-expect-error needs TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
// @ts-expect-error needs TS migration
import { GetSpecificDashboard } from 'in-sap/Dashboards/tables/getDashboardSpecifics';
import getInstanceRelatedResourcesListsForSensors from 'in-sap/subscriptions/getInstanceRelatedResourcesListsForSensors';
// @ts-expect-error needs TS migration
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
// @ts-expect-error needs TS migration
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { timeConfig$, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

const pathSegment = '/abapinstance';
const matrixPrefix = 'abapinstancessensor.';
var systemSnapshotId = '';

interface ColDefinition {
  id: string;
  label: string;
  getContent: (item: any, options?: { timeConfig: any }) => JSX.Element | string;
}

const columnDefinitions: ColDefinition[] = [
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
    getContent(item) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig$}
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

export default function RelatedResources(props: any) {
  systemSnapshotId = props.hostId;
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.abap_instance_related_resources
        }}
      />
      <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} hostId={systemSnapshotId} />
    </>
  );
}

function getTableData({
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  hostId
}: {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: string;
  timeConfig: TimeConfig;
  hostId: string;
}) {
  return getInstanceRelatedResourcesListsForSensors({
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
