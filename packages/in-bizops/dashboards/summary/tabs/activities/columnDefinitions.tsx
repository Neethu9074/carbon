/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { BusinessActivityItem, TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import { number } from 'in-services/formatters/number';
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
      const activityName = item.businessActivity?.activityName;
      return <h4 className={locals.label}>{activityName}</h4>;
    }
  },
  {
    id: 'count',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.countLabel'),
    getContent(item: BusinessActivityItem, { timeConfig }) {
      return (
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-ignore
          timeConfig={timeConfig}
          aggregation="DISTINCT_COUNT"
          metrics={item.metrics.timeseries_counts}
          metric={item.metrics.count}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
  /*
  {
    id: 'duration', //TODO: Fix once backend support exists
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.durationLabel'),
    getContent() {
      return (
        <div>
          <h4>1</h4>
        </div>
      );
    }
  },
  {
    id: 'health', //TODO: Fix once backend support exists
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.healthLabel'),
    getContent() {
      return <h4>Health</h4>;
    }
  }
  */
];
