/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { get, find } from 'lodash';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import { getHumanReadablePluginName } from 'in-sap/Dashboards/tables/getHumanReadablePluginName';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { getAbapSystemListsWithDefaults } from 'in-sap/subscriptions/getAbapSystemLists';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import SapNoDataNotification from 'in-sap/lists/components/SapNoDataNotification';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useDashboardForEntity, sapSystemsList } from 'in-sap/navigation/paths';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { netweaverEnabled } from 'in-services/featureFlags';
import { pageNames } from 'in-services/tracking/pageNames';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import EntityLink from 'in-components/EntityLink';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = sapSystemsList;
const matrixPrefix = 'abapjavasystemslist.';

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
    id: 'instances',
    label: t('in-sap:abapSystemsensor.noOfMonitoringInstances'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="numberOfInstances"
        />
      );
    }
  },
  {
    id: 'serviceName',
    label: t('in-sap:instanceName'),
    getContent(item) {
      return item.serviceName;
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
  function AbapSystemsList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-sap:abapSystems')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.sap,
            pageRootName: pageNames.systems
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<SapNoDataNotification icon="lib_sap" />}
        >
          <ServerTableWithUrlState
            get={getTableData}
            filterColumnDefinitions={({ result }) => {
              const systemSensor =
                result && result.data && Array.isArray(result.data.items)
                  ? result.data.items.find(item => item && item.pluginName)?.pluginName
                  : undefined;
              if (systemSensor === 'sapAbapSystemSensor') {
                return columnDefinition =>
                  columnDefinition.id !== 'hostName' &&
                  columnDefinition.id !== 'overallRating' &&
                  columnDefinition.id !== 'serviceName';
              } else if (systemSensor === 'sapJavaNetWeaverSystemSensor') {
                return columnDefinition =>
                  columnDefinition.id !== 'hostName' &&
                  columnDefinition.id !== 'instances' &&
                  columnDefinition.id !== 'overallRating' &&
                  columnDefinition.id !== 'serviceName';
              } else {
                return columnDefinition => columnDefinition.id !== 'instances';
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
    return getAbapSystemListsWithDefaults(params);
  } else {
    return getFilteredAbapInstances(params);
  }
}

function getFilteredAbapInstances(params) {
  return getAbapSystemListsWithDefaults(params).map(result => {
    const filteredItems = (result?.data?.items || []).filter(item => {
      return item.pluginName === 'sapAbapSystemSensor';
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
    .flatMap(timeConfig => getAbapSystemListsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
