/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { BusinessDataQuery, BusinessProcessItem, Result, TagFilterExpression, TimeConfig } from '@instana/types';
import { Link, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { businessProcessDashboard, summaryTab, businessProcessPath } from 'in-bizops/navigation/paths';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import getBusinessProcesses from 'in-bizops/subscriptions/getBusinessProcesses';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import HealthIcon from 'in-plg/components/HealthIcon/HealthIcon';
import { getChartGranularity } from 'in-stores/metric/metric';
import { number } from 'in-services/formatters/number';
import { Location } from 'in-stores/navigation/types';
import { timeConfig$ } from 'in-stores/time/config';

interface GetBusinessDataProps {
  timeConfig: TimeConfig;
  query: string;
}

function getBusinessData({ timeConfig, query: search }: GetBusinessDataProps) {
  let tagFilterExpression: TagFilterExpression = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: []
  };

  // Don't include processes with blank names
  tagFilterExpression.elements.push({
    name: 'bpm_process_definition_name',
    operator: 'NOT_EQUAL',
    value: '',
    entity: NOT_APPLICABLE,
    type: 'TAG_FILTER'
  });

  // Filter result by user's search query
  if (search && search.length > 0) {
    tagFilterExpression.elements.push({
      name: 'bpm_process_definition_name',
      operator: 'CONTAINS',
      stringValue: search,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }

  const query: BusinessDataQuery = {
    dataType: 'PROCESS',
    metrics: {
      started_processes_total: {
        metric: 'started_processes',
        granularity: 0,
        aggregation: 'DISTINCT_COUNT'
      },
      started_processes_array: {
        metric: 'started_processes',
        granularity: getChartGranularity(timeConfig),
        aggregation: 'DISTINCT_COUNT'
      }
    },
    order: {
      by: 'process_name',
      direction: 'ASC'
    },
    pagination: {
      page: 1,
      pageSize: 5
    },
    tagFilterExpression,
    timeConfig: timeConfig
  };
  return getBusinessProcesses(query);
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
        header: t('in-plg:welcomepage.component.bizopsWidget.count'),
        key: 'count'
      },
      {
        header: t('in-plg:welcomepage.component.bizopsWidget.health'),
        key: 'health'
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

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        return <Link href={getItemLink(item, location, createHref)}>{item?.businessProcess?.definitionName}</Link>;
      }
    },
    {
      key: 'activities',
      getContent({ item }) {
        return <Typography variant="body-regular">{item?.metrics?.activities_count[0][1]}</Typography>;
      }
    },
    {
      key: 'count',
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
      getItems={getBusinessData}
      viewAll
      href={createHrefToPath(businessProcessPath)}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
    />
  );
});
