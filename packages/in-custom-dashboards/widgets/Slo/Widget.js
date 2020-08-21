import React from 'react';

import { SloApName, SloTarget, SliConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { twoDecimalPlaces, number } from 'in-services/formatters/number';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { getSliConfiguration } from 'in-custom-dashboards/api';
import SloTile from 'in-custom-dashboards/widgets/Slo/SloTile';
import { formatDateTime } from 'in-services/formatters/date';
import LightCardV2 from 'in-new-components/Card/LightCardV2';
import Chart from 'in-custom-dashboards/widgets/Slo/Chart';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import theme from 'in-themes';

import locals from './Widget.mless';

const GREEN = theme.lib.colors.green800;
const RED = theme.lib.colors.red800;
const DEFAULT_API = {
  getUnifiedMetrics
};

const oneWeekTimeConfig = {
  windowSize: 7 * 24 * 60 * 60 * 1000
};

export default function Widget({ actions, config, isPreview, title, dragHandle, api = DEFAULT_API }) {
  const slo = config?.[SloTarget] ?? 0.99;
  const apName = config?.[SloApName] ?? '';
  const sliConfigId = config?.[SliConfigId];

  const timeConfig = isPreview ? oneWeekTimeConfig : useTimeConfig();
  timeConfig.to = timeConfig.to ?? new Date().getTime();

  const fromTimestamp = timeConfig.from ?? timeConfig.to - timeConfig.windowSize;
  if (!timeConfig.focusedMoment) timeConfig.focusedMoment = timeConfig.to;

  const metricBaseConfig = {
    sliConfigId: sliConfigId,
    timeShift: { offset: 0 },
    slo,
    aggregation: 'MEAN', // a value must be sent to the backend - it has no meaning at all
    source: 'SLI',
    timeConfig,
    resultType: 'TIME_SERIES'
  };

  const metrics = {
    consumed: {
      ...metricBaseConfig,
      granularity: 3600000,
      metric: 'CONSUMED_ERROR_BUDGET_CHART'
    },
    sli: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'SLI'
    },
    spent: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'ERROR_BUDGET_SPENT'
    },
    remaining: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'ERROR_BUDGET_REMAINING'
    },
    budget: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'TOTAL_ERROR_BUDGET'
    },
    hourlyBudget: {
      ...metricBaseConfig,
      granularity: 3600000,
      metric: 'HOURLY_ERROR_BUDGET_CHART'
    }
  };

  const result = useObservable(api.getUnifiedMetrics({ metrics }), [timeConfig, config]) ?? pendingResult;

  const findResultMetric = id => {
    return (result?.data ?? []).find(dataSerie => dataSerie.id === id)?.values;
  };

  const sli = findResultMetric('sli')?.[0][1];
  const budget = findResultMetric('budget')?.[0][1];
  const remaining = findResultMetric('remaining')?.[0][1];
  const spent = findResultMetric('spent')?.[0][1];

  const sliConfig = useObservable(
    getSliConfiguration(sliConfigId).map(({ data }) => data),
    [sliConfigId]
  );

  const sliColor = slo === null || sli === null ? '' : sli >= slo ? GREEN : RED;
  const budgetColor = !remaining ? '' : remaining > 0 ? GREEN : RED;

  return (
    <LightCardV2
      bodyClassName={locals.bodyNoPadding}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
      title={title}
      headerClassName={locals.title}
      leftHeaderContent={<span className={locals.apName}>{apName ?? valueMissingPlaceholder}</span>}
    >
      <div className={locals.grid}>
        <div className={locals.col}>
          <SloTile
            title="Status"
            value={sli ? twoDecimalPlaces(100 * sli) : valueMissingPlaceholder}
            targetValue={slo ? twoDecimalPlaces(100 * slo) : valueMissingPlaceholder}
            color={sliColor}
            unit="%"
            targetInfo="Target:"
          />
        </div>
        <div className={locals.col}>
          <SloTile
            title="Error Budget Spent"
            value={spent ? number.compact(spent) : null}
            targetValue={budget ? number.compact(budget) : null}
            color={budgetColor}
            unit="calls"
            targetInfo="Error Budget:"
          />
        </div>
        <div className={locals.col}>
          <SloTile
            title="Time Window"
            targetInfo="Dynamic time window"
            valuesClassName={locals.timeRangeValue}
            renderValue={() => (
              <div>
                from{' '}
                {fromTimestamp && (
                  <time dateTime={new Date(fromTimestamp).toISOString()}>{formatDateTime(fromTimestamp)}</time>
                )}
                <br />
                to{' '}
                {timeConfig.to && (
                  <time dateTime={new Date(timeConfig.to).toISOString()}>{formatDateTime(timeConfig.to)}</time>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className={locals.chart}>
        <Chart
          result={result}
          timeConfig={timeConfig}
          consumed={filterAvailableData(findResultMetric('consumed'))}
          hourlyBudget={filterAvailableData(findResultMetric('hourlyBudget'))}
          budget={budget}
          sliEntity={sliConfig?.sliEntity}
          isPreview={isPreview}
        />
      </div>
    </LightCardV2>
  );
}

const filterAvailableData = dataSerie => {
  if (!dataSerie) {
    return [];
  }
  // when no data for a specific metric was returned
  if (dataSerie.length === 1) {
    if (dataSerie[0][0] == null) {
      return [];
    }
  }
  // Filtering-out the values with timestamps in future
  // This should be done on the backend normally, but it was not specified, hence it was
  // implemented on the client in time.
  const now = new Date().getTime();
  return dataSerie.filter(([ts]) => ts <= now);
};
