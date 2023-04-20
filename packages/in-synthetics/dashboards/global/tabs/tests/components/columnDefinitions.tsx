/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { LocationStatus, TestResultListItem, TimeConfig } from '@instana/types';
import { Link, SvgIcon } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import ListActionsColumn from 'in-synthetics/dashboards/global/tabs/tests/components/ListActionsColumn';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { meanLatencyFixed, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { syntheticsSummaryPath, syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import HealthDot from 'in-components/health/HealthDot';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

interface testListProps extends ServerTablePresenterProps<TestResultListItem> {
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

function ApplicationLabelContent({ item }: { item: TestResultListItem }) {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const applicationLabel = item.testResultCommonProperties?.testCommonProperties?.applicationLabel;
  const applicationId = item.testResultCommonProperties?.testCommonProperties?.applicationId;

  if (applicationLabel != null && applicationLabel !== '') {
    return (
      <HorizontalFlexWrapper>
        <SvgIcon type={'lib_application_invert'} />
        <div>
          <Link href={applicationId && getLinkToApplicationDashboard({ applicationId })}>
            <span className={locals.label}>{applicationLabel}</span>
          </Link>
        </div>
      </HorizontalFlexWrapper>
    );
  }

  return (
    <div>
      <span className={locals.label}>{''}</span>
    </div>
  );
}

function TestLabelContent({ item }: { item: TestResultListItem }) {
  const { location, createHref } = useNavigation();
  location.pathname = syntheticsSummaryPath;
  setOrDeleteMatrixKey(
    location,
    syntheticsDashboard,
    'testId',
    item?.testResultCommonProperties?.testCommonProperties?.id
  );
  setOrDeleteMatrixKey(
    location,
    syntheticsDashboard,
    'type',
    item?.testResultCommonProperties?.testCommonProperties?.type
  );

  return (
    <div>
      <Link href={createHref(location)}>
        <h4 className={locals.label}>{item?.testResultCommonProperties?.testCommonProperties?.label}</h4>
      </Link>
    </div>
  );
}

export const columnDefinitions: ColumnDefinition<TestResultListItem, testListProps>[] = [
  {
    id: 'test_name',
    defaultOrderDirection: 'ASC',
    label: t('in-synthetics:dashboard.testList.testLabel'),
    getContent: item => <TestLabelContent item={item} />
  },
  {
    id: 'status',
    label: t('in-synthetics:dashboard.testList.status'),
    defaultOrderDirection: 'ASC',
    getContent(item: TestResultListItem) {
      const status = item?.testResultCommonProperties?.testCommonProperties?.active
        ? t('in-synthetics:dashboard.testList.active')
        : t('in-synthetics:dashboard.testList.paused');
      return (
        <div>
          <h4 className={locals.label}>{status}</h4>
        </div>
      );
    }
  },
  {
    id: 'synthetic_type',
    label: t('in-synthetics:dashboard.testList.type'),
    defaultOrderDirection: 'ASC',
    getContent(item: TestResultListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item?.testResultCommonProperties?.testCommonProperties?.type}</h4>
          <span className={locals.secText}>
            {t('in-synthetics:dashboard.testList.frequencySubText', {
              count: item?.testResultCommonProperties?.testCommonProperties?.frequency
            })}
          </span>
        </div>
      );
    }
  },
  {
    id: 'successRate',
    label: t('in-synthetics:dashboard.testList.successRate'),
    defaultOrderDirection: 'ASC',
    getContent(item: TestResultListItem) {
      const totalRuns = get(item, ['metrics', 'total_test_runs', 0, 1], 0);
      const successRuns = get(item, ['metrics', 'successful_test_runs', 0, 1], 0);
      if (totalRuns != 0) {
        return (
          <div>
            <h4 className={locals.label}>{percentageTwoDecimalPlaces(successRuns / totalRuns)}</h4>
            <span className={locals.secText}>
              {t('in-synthetics:dashboard.testList.successRuns', {
                successRuns: successRuns,
                totalRuns: totalRuns
              })}
            </span>
          </div>
        );
      } else {
        return (
          <div>
            <h4 className={locals.label}>{t('in-synthetics:dashboard.testList.na')}</h4>
          </div>
        );
      }
    }
  },
  {
    id: 'avg_response_time',
    label: t('in-synthetics:dashboard.testList.latency'),
    defaultOrderDirection: 'DESC',
    getContent(item: TestResultListItem, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getChartGranularity(timeConfig)}
          //@ts-ignore
          timeConfig={getResolvedTimeConfig(timeConfig, result?.time)}
          aggregation="MEAN"
          metrics={item?.metrics.avg_response_time}
          metric={item?.metrics.response_time}
          tooltipFormatter={meanLatencyFixed.compact}
        />
      );
    }
  },
  {
    id: 'location',
    label: t('in-synthetics:dashboard.testList.locationLabel'),
    defaultOrderDirection: 'ASC',
    getContent(item: TestResultListItem) {
      const locationStatusList: LocationStatus[] =
        item?.testResultCommonProperties?.testCommonProperties?.locationStatusList ?? [];
      const totalLocations = locationStatusList.length == 0 ? 0 : locationStatusList.length;

      if (totalLocations === 1) {
        const locationStatus: LocationStatus = locationStatusList[0];
        const severity = locationStatus.successRate == 1 ? 0 : 10;
        if (locationStatus.totalTestRuns != 0) {
          return (
            <HorizontalFlexWrapper>
              <SvgIcon type={'lib_synthetic_location'} />
              <div>
                <h4 className={locals.label}>
                  {item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels &&
                    item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels[0]}
                </h4>
                <HealthDot severity={severity} iconSize={5} />
              </div>
            </HorizontalFlexWrapper>
          );
        } else {
          return (
            <HorizontalFlexWrapper>
              <SvgIcon type={'lib_synthetic_location'} />
              <div>
                <h4 className={locals.label}>
                  {item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels &&
                    item.testResultCommonProperties.testCommonProperties?.locationDisplayLabels[0]}
                </h4>
              </div>
            </HorizontalFlexWrapper>
          );
        }
      } else {
        let severities = locationStatusList
          .filter(location => {
            if (location.totalTestRuns != 0) {
              return true;
            }
            return false;
          })
          .map(location => {
            return {
              sev: location.successRate == 1 ? 0 : 10,
              id: location.locationId
            };
          });

        return (
          <HorizontalFlexWrapper>
            <SvgIcon type={'lib_synthetic_location'} />
            <div>
              <h4 className={locals.label}>{t('in-synthetics:dashboard.testList.locations', { totalLocations })}</h4>
              <HorizontalFlexWrapper>
                {severities.map(severity => {
                  return (
                    <HealthDot key={severity.id} severity={severity.sev} iconSize={5} className={locals.dotPadding} />
                  );
                })}
              </HorizontalFlexWrapper>
            </div>
          </HorizontalFlexWrapper>
        );
      }
    }
  },
  {
    id: 'applicationLabel',
    label: t('in-synthetics:dashboard.testList.applicationLabel'),
    defaultOrderDirection: 'ASC',
    getContent(item: TestResultListItem) {
      return <ApplicationLabelContent item={item} />;
    }
  },
  {
    id: 'health',
    label: t('in-synthetics:dashboard.testList.health'),
    defaultOrderDirection: 'ASC',
    getContent(item: TestResultListItem) {
      const totalRuns = get(item, ['metrics', 'total_test_runs', 0, 1], 0);
      const successRuns = get(item, ['metrics', 'successful_test_runs', 0, 1], 0);

      let severity = totalRuns != 0 && successRuns / totalRuns == 1 ? 0 : 10;

      if (severity == 0) {
        return (
          <div>
            <SvgIcon type="lib_check" className={locals.okayIcon} />
          </div>
        );
      } else {
        if (totalRuns != 0) {
          return (
            <div>
              <SvgIcon type="lib_help_error_warning" color={theme.lib.colors.warning} className={locals.icon} />
            </div>
          );
        } else {
          return (
            <div>
              <h4 className={locals.label}>{t('in-synthetics:dashboard.testList.na')}</h4>
            </div>
          );
        }
      }
    }
  },
  {
    id: 'action',
    label: t('in-synthetics:dashboard.testList.action'),
    sortable: false,
    getContent(item: TestResultListItem, { result }) {
      return (
        <HorizontalFlexWrapper>
          <div>
            <ListActionsColumn item={item} isLoading={result?.progress?.loading ?? false} />
          </div>
        </HorizontalFlexWrapper>
      );
    }
  }
];
