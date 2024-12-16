/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { BusinessActivityItem, TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import {
  businessActivityPath,
  businessActivitySummaryPath,
  businessProcessDashboard
} from 'in-bizops/navigation/paths';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { millis, number, timeByMillisZeroDecimalPlaces } from 'in-services/formatters/number';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getChartGranularity } from 'in-stores/metric/metric';
import { bizopsActivitySelect } from 'in-bizops/tracker';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

export interface TimeResult {
  time: number;
}

interface activitiesListProps extends ServerTablePresenterProps<BusinessActivityItem> {
  timeConfig: TimeConfig;
}

export const activitiesColumnDefinitions: ColumnDefinition<BusinessActivityItem, activitiesListProps>[] = [
  {
    id: 'bpm_activity_name',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.nameLabel'),
    getContent(item: BusinessActivityItem) {
      let activityName: string;
      if (item.businessActivity?.activityName) {
        activityName = item.businessActivity?.activityName;
      } else if (item.businessActivity?.activityType) {
        activityName = t('in-bizops:lists.unnamedActivity', { activityType: item.businessActivity?.activityType });
      } else {
        activityName = t('in-bizops:lists.unnamedActivity');
      }

      return ActivityLink(activityName, item.businessActivity?.activityId);
    }
  },
  {
    id: 'count',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.countLabel'),
    getContent(item: BusinessActivityItem, { timeConfig, result }) {
      return (
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-expect-error
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="DISTINCT_COUNT"
          metrics={item.metrics?.timeseries_counts}
          metric={item.metrics?.count}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'duration',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.durationLabel'),
    getContent(item: BusinessActivityItem, { timeConfig, result }) {
      return (
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-ignore
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics?.timeseries_duration}
          metric={item.metrics?.duration}
          tooltipFormatter={timeByMillisZeroDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'call_latency',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.latencyLabel'),
    getContent(item: BusinessActivityItem, { timeConfig, result }) {
      return (
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-ignore
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics?.timeseries_latency}
          metric={item.metrics?.call_latency}
          tooltipFormatter={millis.compact}
        />
      );
    }
  }
];

function ActivityLink(activityName: string | undefined, activityId: string | undefined) {
  const { location, createHref } = useNavigation();

  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');

  const activityTracking = {
    path: location.pathname,
    processId: businessProcessId,
    processName: businessProcessName,
    activityName: activityName as string
  };

  location.pathname = businessActivitySummaryPath;
  setOrDeleteMatrixKey(location, businessActivityPath, 'activityName', activityName);
  setOrDeleteMatrixKey(location, businessActivityPath, 'activityId', activityId);

  return (
    <Link
      className={locals.label}
      href={createHref(location)}
      onClick={() => bizopsActivitySelect(activityTracking)}
    >
      {activityName}
    </Link>
  );
}
