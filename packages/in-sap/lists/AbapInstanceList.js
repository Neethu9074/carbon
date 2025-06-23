/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { get, find } from 'lodash';

import { getAbapOrJavaInstanceListsWithDefaults } from 'in-sap/subscriptions/getAbapOrJavaInstanceLists';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getHumanReadablePluginName } from 'in-sap/Dashboards/tables/getHumanReadablePluginName';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { number, percentagePlain, percentage } from 'in-services/formatters/number';
import SapNoDataNotification from 'in-sap/lists/components/SapNoDataNotification';
import getWorkProcessStatus from 'in-sap/Dashboards/tables/WorkProcessHelper.tsx';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useDashboardForEntity, sapInstanceList } from 'in-sap/navigation/paths';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { netweaverEnabled } from 'in-services/featureFlags';
import { pageNames } from 'in-services/tracking/pageNames';
import { timeConfig$ } from 'in-stores/time/config';
import EntityLink from 'in-components/EntityLink';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = sapInstanceList;
const matrixPrefix = 'abapinstanceslist.';

function SapLabelContent({ item }) {
  const href = useDashboardForEntity(item.id, item.pluginName, item.label);
  return <EntityLink icon={getIconType(item.pluginName)} label={item.label} href={href} />;
}

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-sap:name'),
    getContent(item) {
      return <SapLabelContent item={item} />;
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
    id: 'overallRating',
    label: t('in-sap:dashboards.overallRating'),
    getContent(item) {
      return <Badge color={colorFormatter(item.overallRating)}>{item.overallRating}</Badge>;
    }
  },
  {
    id: 'status',
    label: t('in-sap:dashboards.status'),
    getContent(item) {
      return <Badge color={colorFormatter(item.overallRating)}>{item.overallRating}</Badge>;
    }
  },
  {
    id: 'cpu',
    label: t('in-sap:dashboards.cpuUsage'),
    getContent(item, { timeConfig }) {
      if (item.pluginName == 'sapAbapInstanceSensor') {
        return (
          <InfrastructureMetricSparkChart
            snapshotId={item.id}
            timeConfig={timeConfig}
            formatter={percentagePlain.compact}
            metric="cpuMetricStats.totalUtilization"
          />
        );
      } else {
        return (
          <InfrastructureMetricSparkChart
            snapshotId={item.id}
            timeConfig={timeConfig}
            formatter={percentage.detailed}
            metric="customMetrics.kpi.cpuUsage"
          />
        );
      }
    }
  },
  {
    id: 'memory',
    label: t('in-sap:dashboards.memoryUsage'),
    getContent(item, { timeConfig }) {
      if (item.pluginName == 'sapAbapInstanceSensor') {
        return (
          <InfrastructureMetricSparkChart
            snapshotId={item.id}
            timeConfig={timeConfig}
            formatter={percentage.detailed}
            metric="swapmemory.usedMemory"
          />
        );
      } else {
        return (
          <InfrastructureMetricSparkChart
            snapshotId={item.id}
            timeConfig={timeConfig}
            formatter={percentage.detailed}
            metric="customMetrics.kpi.memoryUsage"
          />
        );
      }
    }
  },
  {
    id: 'user',
    label: t('in-sap:dashboards.userLogins'),
    getContent(item, { timeConfig }) {
      if (item.pluginName == 'sapAbapInstanceSensor') {
        return (
          <InfrastructureMetricSparkChart
            snapshotId={item.id}
            timeConfig={timeConfig}
            formatter={number.compact}
            metric="sapMetricsStats.userSession"
          />
        );
      } else {
        return (
          <InfrastructureMetricSparkChart
            snapshotId={item.id}
            timeConfig={timeConfig}
            formatter={number.compact}
            metric="customMetrics.session.loggedInUsers"
          />
        );
      }
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
  defaultOrderBy: 'issues',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function RegionList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-sap:abapOrJavaInstances')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.sap,
            pageRootName: pageNames.instances
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<SapNoDataNotification icon="lib_sap" />}
        >
          <ServerTableWithUrlState
            get={getTableData}
            filterColumnDefinitions={({ result }) => {
              const pluginName =
                result && result.data && Array.isArray(result.data.items)
                  ? result.data.items.find(item => item && item.pluginName)?.pluginName
                  : undefined;
              if (pluginName == 'sapAbapInstanceSensor') {
                return columnDefinition =>
                  columnDefinition.id !== 'overallRating' && columnDefinition.id !== 'hostName';
              } else if (pluginName == 'sapJavaNetWeaverInstanceSensor') {
                return columnDefinition =>
                  columnDefinition.id !== 'overallRating' &&
                  columnDefinition.id !== 'cpu' &&
                  columnDefinition.id !== 'memory' &&
                  columnDefinition.id !== 'numberOfDumps' &&
                  columnDefinition.id !== 'inBoundIdoc' &&
                  columnDefinition.id !== 'outBoundIdoc' &&
                  columnDefinition.id !== 'status' &&
                  columnDefinition.id !== 'user' &&
                  columnDefinition.id !== 'workProcess' &&
                  columnDefinition.id !== 'cancelledJob';
              } else {
                return columnDefinition =>
                  columnDefinition.id !== 'cpuUsage' &&
                  columnDefinition.id !== 'numberOfDumps' &&
                  columnDefinition.id !== 'inBoundIdoc' &&
                  columnDefinition.id !== 'outBoundIdoc' &&
                  columnDefinition.id !== 'status' &&
                  columnDefinition.id !== 'cancelledJob';
              }
            }}
            timeConfig={timeConfig}
          />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  if (netweaverEnabled) {
    return getAbapOrJavaInstanceListsWithDefaults(params);
  } else {
    return getFilteredAbapInstances(params);
  }
}
function getFilteredAbapInstances(params) {
  return getAbapOrJavaInstanceListsWithDefaults(params).map(result => {
    const filteredItems = (result?.data?.items || []).filter(item => {
      return item.pluginName === 'sapAbapInstanceSensor';
    });
    return {
      ...result,
      data: {
        ...result.data,
        items: filteredItems
      }
    };
  });
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getAbapOrJavaInstanceListsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
