/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import { getHumanReadablePluginName } from 'in-sap/Dashboards/tables/getHumanReadablePluginName';
import { getSapDbInstanceListsWithDefaults } from 'in-sap/subscriptions/getSapDbInstanceLists';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { percentage, zeroDecimalPlaces, number, bytes } from 'in-services/formatters/number';
import { getSapDbInstanceAnyDBLists } from 'in-sap/subscriptions/getSapDbInstanceAnyDBLists';
import { getSapDbInstanceHanaLists } from 'in-sap/subscriptions/getSapDbInstanceHanaLists';
import { getSapDbInstanceDB2Lists } from 'in-sap/subscriptions/getSapDbInstanceDB2Lists';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { useDashboardForEntity, sapDbInstanceList } from 'in-sap/navigation/paths';
import SapNoDataNotification from 'in-sap/lists/components/SapNoDataNotification';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import EmptyStateHandler from 'in-sap/lists/components/EmptyStateHandler';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { timeConfig$ } from 'in-stores/time/config';
import EntityLink from 'in-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = sapDbInstanceList;
const matrixPrefix = 'sapdbinstancelist.';

function SapLabelContent({ item }) {
  const href = useDashboardForEntity(item.id, item.pluginName, item.label);
  return <EntityLink icon={getIconType(item.pluginName)} label={item.label} href={href} />;
}

const DashboardLink = ({ item, timeConfig }) => {
  const snapshot = fromJS(item);
  const href = useGetDashboardLink()(item.id, {
    pathname: '/physical/dashboard',
    to: timeConfig.to,
    focusedMoment: timeConfig.to
  });

  return <EntityLink icon={getIconType(item.pluginName)} label={getLabel(snapshot)} href={href} />;
};

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-sap:name'),
    getContent(item) {
      return <SapLabelContent item={item} />;
    }
  },
  {
    id: 'infralabel',
    label: t('in-sap:name'),
    getContent: (item, { timeConfig }) => <DashboardLink item={item} timeConfig={timeConfig} />
  },
  {
    id: 'objectType',
    label: t('in-sap:objectType'),
    getContent(item) {
      return getHumanReadablePluginName(item);
    }
  },
  {
    id: 'status',
    label: t('in-sap:dashboards.status'),
    getContent(item) {
      return getBadgeInfo(item);
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
    id: 'cpu',
    label: t('in-sap:dashboards.cpuUsage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="stats.cpuUsage"
        />
      );
    }
  },
  {
    id: 'memory',
    label: t('in-sap:dashboards.memoryUsage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={bytes.detailed}
          metric="stats.usedMemory"
        />
      );
    }
  },
  {
    id: 'user',
    label: t('in-sap:dashboards.userSessions'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={zeroDecimalPlaces}
          metric="stats.sessionsTotalCount"
        />
      );
    }
  },
  {
    id: 'overallRating',
    label: t('in-sap:dashboards.overallRating'),
    getContent(item) {
      return getBadgeInfo(item);
    }
  },
  {
    id: 'db2Queries',
    label: t('in-forge:plugins.db2Database.queries'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="databases.queries"
        />
      );
    }
  },
  {
    id: 'db2Connection',
    label: t('in-forge:plugins.db2Database.connections'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="databases.connectionsCount"
        />
      );
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

function getBadgeInfo(params) {
  return <Badge color={colorFormatter(params.hostActiveStatus)}>{params.hostActiveStatus}</Badge>;
}

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
  function SapDbInstanceList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-sap:sapdbinstance')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.sap,
            pageRootName: pageNames.sap_databases
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataForDBToRender}
          FallbackComponent={<SapNoDataNotification icon="lib_sap" />}
        >
          <div>
            <EmptyStateHandler getHasDataToRender={getHasDataForHanaToRender}>
              <ServerTableWithUrlState
                get={getTableDataForHana}
                filterColumnDefinitions={() => {
                  return columnDefinition =>
                    columnDefinition.id !== 'label' &&
                    columnDefinition.id !== 'objectType' &&
                    columnDefinition.id !== 'overallRating' &&
                    columnDefinition.id !== 'db2Queries' &&
                    columnDefinition.id !== 'db2Connection';
                }}
                timeConfig={timeConfig}
                showHeaderCount
                cardTitle={t('in-sap:sapHana')}
              />
            </EmptyStateHandler>
          </div>
          <div>
            <EmptyStateHandler getHasDataToRender={getHasDataForDB2ToRender}>
              <ServerTableWithUrlState
                get={getTableDataForDB2}
                filterColumnDefinitions={() => {
                  return columnDefinition =>
                    columnDefinition.id !== 'label' &&
                    columnDefinition.id !== 'objectType' &&
                    columnDefinition.id !== 'cpu' &&
                    columnDefinition.id !== 'memory' &&
                    columnDefinition.id !== 'user' &&
                    columnDefinition.id !== 'overallRating';
                }}
                timeConfig={timeConfig}
                showHeaderCount
                cardTitle={t('in-sap:db2')}
              />
            </EmptyStateHandler>
          </div>
          <div>
            <EmptyStateHandler getHasDataToRender={getHasDataForSolmanToRender}>
              <ServerTableWithUrlState
                get={getTableDataForSolman}
                filterColumnDefinitions={() => {
                  return columnDefinition =>
                    columnDefinition.id !== 'infralabel' &&
                    columnDefinition.id !== 'status' &&
                    columnDefinition.id !== 'cpu' &&
                    columnDefinition.id !== 'memory' &&
                    columnDefinition.id !== 'user' &&
                    columnDefinition.id !== 'db2Queries' &&
                    columnDefinition.id !== 'db2Connection';
                }}
                timeConfig={timeConfig}
                showHeaderCount
                cardTitle={t('in-sap:sapSolman')}
              />
            </EmptyStateHandler>
          </div>
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getHasDataForDB2ToRender() {
  return timeConfig$
    .flatMap(timeConfig => getSapDbInstanceDB2Lists({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getHasDataForHanaToRender() {
  return timeConfig$
    .flatMap(timeConfig => getSapDbInstanceHanaLists({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getHasDataForSolmanToRender() {
  return timeConfig$
    .flatMap(timeConfig => getSapDbInstanceListsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getHasDataForDBToRender() {
  return timeConfig$
    .flatMap(timeConfig => getSapDbInstanceAnyDBLists({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getTableDataForHana(params) {
  return getSapDbInstanceHanaLists(params);
}

function getTableDataForDB2(params) {
  return getSapDbInstanceDB2Lists(params);
}

function getTableDataForSolman(params) {
  return getSapDbInstanceListsWithDefaults(params);
}
