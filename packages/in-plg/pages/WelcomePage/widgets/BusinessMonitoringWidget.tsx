/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { BusinessProcessItem, Result, TimeConfig, BizOpsMetricConfiguration } from '@instana/types';
import { IconButton, Link } from '@instana/components';
import { Observable } from '@instana/observables';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import getBusinessProcessesWithDefaults from 'in-bizops/subscriptions/helpers/getBusinessProcessesWithDefaults';
// @ts-expect-error Module needs to be translated to TS
import { add, remove } from 'in-cockpit/starredItems';
import { businessProcessDashboard, summaryTab, businessProcessPath } from 'in-bizops/navigation/paths';
import TypographyWithTooltip from 'in-plg/components/TypographyWithTooltip/TypographyWithTooltip';
import { businessProcess as businessProcessType } from 'in-cockpit/starredItems/types';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import getBusinessProcess from 'in-bizops/subscriptions/getBusinessProcess';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import { bizopsProcessesListSelect } from 'in-bizops/tracker';
import { number } from 'in-services/formatters/number';
import { Location } from 'in-stores/navigation/types';
import { timeConfig$ } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip/Tooltip';

interface GetBusinessDataProps {
  timeConfig: TimeConfig;
  query: string;
}

function getBusinessData({ timeConfig, query: search }: GetBusinessDataProps) {
  return getBusinessProcessesWithDefaults({ timeConfig, query: search });
}

function handleFavoriteClick(id: string, item: any, isFavourite: boolean) {
  if (!id && !item) return;
  if (isFavourite) {
    remove({ id: id, type: businessProcessType });
  } else {
    add({
      id: item?.businessProcess?.definitionId,
      label: item?.businessProcess?.definitionName,
      type: businessProcessType
    });
  }
}

export default connectTo(() => ({
  timeConfig: timeConfig$
}))(function BusinessMonitoringWidget({ config, timeConfig, widgetLabel, dashboardTileProps }: WidgetProps) {
  const getHeaders = () => {
    return [
      {
        header: t('in-plg:welcomepage.component.bizopsWidget.name'),
        key: 'name'
      },
      {
        header: t('in-plg:welcomepage.component.bizopsWidget.activities'),
        key: 'activities'
      },
      {
        header: t('in-plg:welcomepage.component.bizopsWidget.started'),
        key: 'count'
      },
      {
        header: t('in-plg:welcomepage.component.bizopsWidget.health'),
        key: 'health'
      },
      {
        key: 'favourite',
        header: ''
      }
    ];
  };

  const { location, createHref, createHrefToPath } = useNavigation();

  function getItemLink(item: BusinessProcessItem, location: Location, createHref: (target: Location) => string) {
    location.pathname = `${businessProcessDashboard}${summaryTab}`;
    setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionName', item?.businessProcess?.definitionName);
    setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionId', item?.businessProcess?.definitionId);
    setOrDeleteMatrixKey(location, businessProcessDashboard, 'serviceId', item?.service?.id);

    return createHref(location);
  }

  function getItem(id: string, timeConfig: TimeConfig): Observable<Result<BusinessProcessItem>> {
    const started_processes_array: BizOpsMetricConfiguration = {
      metric: 'started_processes',
      granularity: getChartGranularity(timeConfig),
      aggregation: 'DISTINCT_COUNT'
    };
    const started_processes_total: BizOpsMetricConfiguration = {
      metric: 'started_processes',
      granularity: 0,
      aggregation: 'DISTINCT_COUNT'
    };
    const activities_count: BizOpsMetricConfiguration = {
      metric: 'activity_count_distinct',
      granularity: 0,
      aggregation: 'DISTINCT_COUNT'
    };

    // Have to use the endpoint to fetch ONE process instead of
    // getBusinessProcesses that fetches an ARRAY of processes due
    // to how the StarredItemList works
    return getBusinessProcess({
      timeConfig,
      metrics: {
        started_processes_array: started_processes_array,
        started_processes_total: started_processes_total,
        activities_count: activities_count
      },
      processDefinitionId: id
    });
  }

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        const processTracking = {
          path: location.pathname,
          processId: item?.businessProcess?.definitionId,
          processName: item?.businessProcess?.definitionName
        };

        return (
          <Tooltip content={item?.businessProcess?.definitionName} align="auto" caret={false} delay={300}>
            <Link
              href={getItemLink(item, location, createHref)}
              onClick={() => bizopsProcessesListSelect(processTracking)}
            >
              {item?.businessProcess?.definitionName}
            </Link>
          </Tooltip>
        );
      }
    },
    {
      key: 'activities',
      getContent({ item }) {
        return <TypographyWithTooltip content={item?.metrics?.activities_count[0][1]} />;
      }
    },
    {
      key: 'started',
      getContent({
        item,
        result,
        timeConfig
      }: {
        item: BusinessProcessItem;
        result: Result<BusinessProcessItem>;
        timeConfig: TimeConfig;
      }) {
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getChartGranularity(timeConfig)}
            timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
            aggregation="DISTINCT_COUNT"
            metrics={item?.metrics?.started_processes_array}
            metric={item?.metrics?.started_processes_total?.[0][1]}
            tooltipFormatter={number.compact}
          />
        );
      }
    },
    {
      key: 'health',
      getContent({ item }) {
        return <HealthIcon severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)} iconSize="xs" />;
      }
    },
    {
      key: 'favourite',
      getContent({ id, item, isDisabled = false, isFavourite = false }) {
        return (
          <IconButton
            type={
              isFavourite
                ? 'lib_actions_favorite_filled'
                : item?.pinned
                ? 'lib_actions_favorite_filled'
                : 'lib_actions_favorite'
            }
            onClick={() => handleFavoriteClick(id, item, isFavourite)}
            iconSize="xs"
            disabled={isDisabled}
          />
        );
      }
    }
  ];

  const generalProps = {
    ...config,
    timeConfig,
    columnDefinitions,
    headers: getHeaders()
  };

  return (
    <DatatableWrapper
      {...generalProps}
      tableType="businessMonitoringWidget"
      pinnedItemTypes={[businessProcessType]}
      getItems={getBusinessData}
      getItem={getItem}
      viewAll
      href={createHrefToPath(businessProcessPath)}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
      searchPlaceholderLabel={t('in-plg:welcomepage.component.bizopsWidget.searchPlaceholderLabel')}
      viewAllLabel={t('in-plg:welcomepage.component.bizopsWidget.viewAllLabel')}
    />
  );
});
