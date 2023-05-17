/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { BusinessProcess, TimeConfig } from '@instana/types';

//// @ts-expect-error Module needs to be translated to TS
//import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
// @ts-expect-error Module needs to be translated to TS
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
// @ts-expect-error Could not find declaration type
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
//import { getChartGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';
import { businessProcessDashboard, summaryTab } from 'in-bizops/navigation/paths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

import locals from './columnDefinitions.mless';

interface bpListProps extends ServerTablePresenterProps<BusinessProcess> {
  timeConfig: TimeConfig;
}

export interface TimeResult {
  time: number;
}

/*
 * Returns a normalized timeConfig where "to" is set to result.time (unless it is already set and equal to result.time,
 * in which case timeConfig is returned unmodified). Instead of a result object with an attribute "time" you can also
 * pass in a number (millis since epoch) directly.
 */
export function getResolvedTimeConfig(timeConfig: TimeConfig, resultOrTime: number | TimeResult): TimeConfig {
  let resultTime;
  if (typeof resultOrTime === 'number') {
    resultTime = resultOrTime;
  } else if (typeof resultOrTime === 'object') {
    resultTime = resultOrTime.time;
  }

  if (timeConfig.to === resultTime) {
    return timeConfig;
  }
  return {
    ...timeConfig,
    to: resultTime,
    focusedMoment: resultTime
  };
}

function BusinessProcessNameColumnContent(item: BusinessProcess) {
  const { location, createHref } = useNavigation();

  location.pathname = `${businessProcessDashboard}${summaryTab}`;
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'name', item.name);

  return <SeverityAwareEntityLink severity={getSeverity()} label={item.name} href={createHref(location)} />;
}

function getSeverity() {
  //This needs to be changed with item.severity when it is ready.
  return 1;
}

export const processColumnDefinitions: ColumnDefinition<BusinessProcess, bpListProps>[] = [
  {
    id: 'bpm_process_name',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.nameLabel'),
    getContent: BusinessProcessNameColumnContent
  },
  {
    id: 'bpm_root_process_id',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.startLabel'),
    //getContent(item: BusinessProcess, { result, timeConfig }) {
    getContent(item: BusinessProcess) {
      return (
        /* Need to enable this when backend support is ready
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-ignore
          timeConfig={getResolvedTimeConfig(timeConfig, result?.time)}
          aggregation="DISTINCT_COUNT"
          metrics={''}
          metric={item.startedProcesses}
          tooltipFormatter={''}
        />*/
        <div>
          <h4 className={locals.label}>{item.startedProcesses}</h4>
        </div>
      );
    }
  },
  {
    id: 'bpm_activity_id',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.activityLabel'),
    getContent(item: BusinessProcess) {
      return (
        <div>
          <h4 className={locals.label}>{item.activitiesCount}</h4>
        </div>
      );
    }
  },
  {
    id: 'health',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.healthLabel'),
    /* When backend is ready, the health icon needs to be driven by item.openIssues */
    getContent(item, { timeConfig }) {
      return (
        <ApplicationEntityHealthIndicatorBehavior
          serviceId={'0fce0559eaebe9b65b13c8e9050d5060024f4586'}
          openIssues={item.activitiesCount}
          maxSeverity={1}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={getResolvedTimeConfig(timeConfig, 0)}
          inContentArea
        />
      );
    }
  }
];
