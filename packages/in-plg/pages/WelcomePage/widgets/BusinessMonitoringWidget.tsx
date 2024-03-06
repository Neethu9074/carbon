/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { BusinessProcessItem, Result, TimeConfig } from '@instana/types';
import { Link, Stack, SvgIcon, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { businessProcessDashboard, summaryTab, businessProcessPath } from 'in-bizops/navigation/paths';
import { getBusinessProcessListData } from 'in-bizops/lists/businessProcess/BusinessProcessList';
//@ts-ignore doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import HealthDot from 'in-components/health/HealthDot';
import { number } from 'in-services/formatters/number';
import { Location } from 'in-stores/navigation/types';
import { timeConfig$ } from 'in-stores/time/config';
import DatatableWrapper from './DatatableWrapper';

function getBusinessData(params: any) {
  return getBusinessProcessListData(params);
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
        return (
          <Stack direction="horizontal" align="center">
            <HealthDot severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)} iconSize={10} />
            <SvgIcon type="lib_bizops" />
            <Link href={getItemLink(item, location, createHref)}>{item?.businessProcess?.definitionName}</Link>
          </Stack>
        );
      }
    },
    {
      key: 'activities',
      getContent({ item }) {
        return <Typography variant="body-regular">{item?.businessProcess?.activitiesCount}</Typography>;
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
            metrics={item?.metrics?.started_processes}
            metric={item?.businessProcess?.startedInstancesCount}
            tooltipFormatter={number.compact}
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
      getItems={getBusinessData}
      viewAll
      href={createHrefToPath(businessProcessPath)}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
    />
  );
});
