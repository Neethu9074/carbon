/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { BusinessProcessItem, TimeConfig } from '@instana/types';

//import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
// @ts-expect-error Module needs to be translated to TS
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
// @ts-expect-error Could not find declaration type
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
//import { getChartGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';
import { businessProcessDashboard, summaryTab } from 'in-bizops/navigation/paths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import { number } from 'in-services/formatters/number';

import locals from './columnDefinitions.mless';

interface bpListProps extends ServerTablePresenterProps<BusinessProcessItem> {
  timeConfig: TimeConfig;
}

export interface TimeResult {
  time: number;
}

function BusinessProcessNameColumnContent(item: BusinessProcessItem) {
  const { location, createHref } = useNavigation();

  const businessProcessId: string = item.businessProcess.definitionId;
  const businessProcessName: string =
    item.businessProcess.definitionName.length > 0 ? item.businessProcess.definitionName : businessProcessId;
  const serviceId: string = item.service?.id ?? '';

  location.pathname = `${businessProcessDashboard}${summaryTab}`;
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionName', businessProcessName);
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionId', businessProcessId);
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'serviceId', serviceId);

  return (
    <SeverityAwareEntityLink severity={getSeverity(item)} label={businessProcessName} href={createHref(location)} />
  );
}

function getSeverity(item: BusinessProcessItem) {
  return get(item, ['metrics', 'maxSeverity', 0, 1], 0);
}

export const processColumnDefinitions: ColumnDefinition<BusinessProcessItem, bpListProps>[] = [
  {
    id: 'process_name',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.nameLabel'),
    getContent: BusinessProcessNameColumnContent
  },
  {
    id: 'started_processes',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.startLabel'),
    getContent(item: BusinessProcessItem, { timeConfig, result }) {
      return (
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-ignore
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="DISTINCT_COUNT"
          metrics={item.metrics.started_processes}
          metric={item.businessProcess.startedInstancesCount}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'activities_count',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.activityLabel'),
    getContent(item: BusinessProcessItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.businessProcess.activitiesCount}</h4>
        </div>
      );
    }
  },
  {
    id: 'health',
    sortable: false,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.healthLabel'),
    /* When backend is ready, the health icon needs to be driven by item.openIssues */
    getContent(item: BusinessProcessItem, { result, timeConfig }) {
      return (
        <ApplicationEntityHealthIndicatorBehavior
          serviceId={item.service?.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          IndicatorPresenter={HealthIndicatorPresenter}
          //@ts-ignore type error
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          inContentArea
        />
      );
    }
  }
];
