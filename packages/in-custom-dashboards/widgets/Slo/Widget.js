import theme from 'in-themes';
import { get } from 'lodash';
import moment from 'moment';
import React from 'react';

import {
  ApConfigId,
  Fixed,
  SloTarget,
  SliConfigId,
  TimeWindowType,
  TimeWindowDuration,
  TimeWindowDurationUnit,
  TimeWindowStart,
  parsedTimestamp,
  Rolling,
  Dynamic
} from 'in-custom-dashboards/widgets/Slo/form';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getSliFormatter } from 'in-custom-dashboards/widgets/Slo/sliConfigUtils';
import SloTimeTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTimeTile';
import getApplication from 'in-subscription/application/getApplication';
import SloTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTile';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { getSliConfiguration } from 'in-custom-dashboards/api';
import LightCardV2 from 'in-new-components/Card/LightCardV2';
import { percentage } from 'in-services/formatters/number';
import Chart from 'in-custom-dashboards/widgets/Slo/Chart';
import { pendingResult } from 'in-services/fixedObjects';
import { alwaysNull } from 'in-services/fixedStreams';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import connectTo from 'in-hoc/connectTo';

import locals from './Widget.mless';

const GREEN = theme.lib.colors.green800;
const RED = theme.lib.colors.red800;

const oneMinute = 60 * 1000;
const oneHour = 60 * oneMinute;
const oneDay = 24 * oneHour;
const oneWeekTimeConfig = {
  windowSize: 7 * oneDay
};

export default function Widget({ actions, config, isPreview, title, dragHandle }) {
  const slo = config?.[SloTarget] ?? '';
  const apConfigId = config?.[ApConfigId];
  const sliConfigId = config?.[SliConfigId];

  const timeWindowType = config?.[TimeWindowType] ?? Dynamic;
  const isDynamic = timeWindowType === Dynamic;
  const isRolling = timeWindowType === Rolling;
  const isFixed = timeWindowType === Fixed;
  const timeWindowDuration = config?.[TimeWindowDuration] ?? 1;
  const timeWindowDurationUnit = config?.[TimeWindowDurationUnit] ?? 'weeks';
  const timeWindowStartDate = config?.[TimeWindowStart]?.date;
  const timeWindowStartTime = config?.[TimeWindowStart]?.time;

  const timeConfig = isPreview ? oneWeekTimeConfig : useTimeConfig();

  const timeWindowConfig = {
    ...timeConfig
  };

  let fromTimestamp = timeConfig.from ?? (timeConfig.to ?? new Date().getTime()) - timeConfig.windowSize;
  let toTimestamp = timeConfig.to ?? fromTimestamp + timeConfig.windowSize;

  if (isRolling) {
    fromTimestamp = moment(toTimestamp)
      .subtract(timeWindowDuration, timeWindowDurationUnit)
      .valueOf();
    timeWindowConfig.windowSize = toTimestamp - fromTimestamp;
    timeWindowConfig.from = fromTimestamp;
  }

  if (isFixed) {
    let timeWindowStartTimeStamp = parsedTimestamp(timeWindowStartDate + '  ' + timeWindowStartTime);
    if (timeWindowStartTimeStamp) {
      let now = moment();
      let nextStart = moment(timeWindowStartTimeStamp);
      let latestIntervalStart;
      do {
        latestIntervalStart = nextStart;
        nextStart = latestIntervalStart.clone().add(timeWindowDuration, timeWindowDurationUnit);
      } while (nextStart.isBefore(now));

      fromTimestamp = latestIntervalStart.valueOf();
      toTimestamp = nextStart.valueOf();
      timeWindowConfig.from = fromTimestamp;
      timeWindowConfig.windowSize = nextStart.valueOf() - fromTimestamp;
    }
  }
  if (!timeConfig.autoRefresh) {
    timeWindowConfig.to = toTimestamp;
    timeWindowConfig.focusedMoment = toTimestamp;
  }

  const metricBaseConfig = {
    sliConfigId,
    timeShift: { offset: 0 },
    slo,
    aggregation: 'MEAN', // a value must be sent to the backend - it has no meaning at all
    source: 'SLI',
    timeConfig: timeWindowConfig,
    resultType: 'TIME_SERIES'
  };

  const granularity = getGranularity(timeWindowConfig);
  const metrics = {
    consumed: {
      ...metricBaseConfig,
      metric: 'CONSUMED_ERROR_BUDGET_CHART',
      granularity
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
      metric: 'HOURLY_ERROR_BUDGET_CHART',
      granularity
    }
  };

  const result = useObservable(getUnifiedMetrics({ metrics }), [timeConfig, config]) ?? pendingResult;

  const findResultMetric = id => {
    return (result?.data ?? []).find(dataSeries => dataSeries.id === id)?.values;
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

  const sliFormatter = getSliFormatter(sliConfig?.sliEntity);

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
      leftHeaderContent={<LeftHeader applicationId={apConfigId} />}
    >
      <div className={locals.grid}>
        <div className={locals.col}>
          <SloTile
            title="Status"
            value={sli ? percentage.detailed(sli) : valueMissingPlaceholder}
            targetInfo="Target:"
            targetValue={slo ? percentage.detailed(slo) : valueMissingPlaceholder}
            color={sliColor}
          />
        </div>
        <div className={locals.col}>
          <SloTile
            title="Error Budget Spent"
            value={spent ? sliFormatter(spent) : valueMissingPlaceholder}
            targetInfo="Error Budget:"
            targetValue={budget ? sliFormatter(budget) : valueMissingPlaceholder}
            color={budgetColor}
          />
        </div>
        <div className={locals.col}>
          <SloTimeTile
            title="Time Window"
            info={isDynamic ? 'Dynamic time window' : isRolling ? 'Rolling time window' : 'Fixed time window'}
            valuesClassName={locals.timeRangeValue}
            fromTimestamp={fromTimestamp}
            toTimestamp={toTimestamp}
          />
        </div>
      </div>
      <div className={locals.chart}>
        <Chart
          result={result}
          timeConfig={timeWindowConfig}
          granularity={granularity}
          consumed={filterAvailableData(findResultMetric('consumed'))}
          hourlyBudget={filterAvailableData(findResultMetric('hourlyBudget'))}
          budget={budget}
          sliConfig={sliConfig}
          isPreview={isPreview}
          disableZooming={isFixed || isRolling}
        />
      </div>
    </LightCardV2>
  );
}

const LeftHeader = connectTo(
  ({ applicationId }) => ({
    apName: applicationId
      ? getApplication({ id: applicationId }).map(result => get(result, ['data', 'label'], null))
      : alwaysNull
  }),
  function leftHeaderApName({ apName }) {
    return <span className={locals.apName}>{apName ?? valueMissingPlaceholder}</span>;
  }
);

const filterAvailableData = dataSeries => {
  if (!dataSeries) {
    return [];
  }
  // when no data for a specific metric was returned
  if (dataSeries.length === 1) {
    if (dataSeries[0][0] == null) {
      return [];
    }
  }
  // Filtering-out the values with timestamps in future
  // This should be done on the backend normally, but it was not specified, hence it was
  // implemented on the client in time.
  const now = new Date().getTime();
  return dataSeries.filter(([ts]) => ts <= now);
};

function getGranularity(timeConfig) {
  const now = Date.now();
  const toOrNow = timeConfig.to ?? now;
  const from = toOrNow - timeConfig.windowSize;

  const wiggleRoom = oneMinute;
  if (timeConfig.windowSize <= 7 * oneDay && from > now - 7 * oneDay - wiggleRoom) {
    // if timeframe is within the last 7 days, and window-size less or equal to a day, then request metric even in
    // one minute granularity. We use a small "wiggle-room" of 1 minutes to circumvent that settings of "Last 7 days"
    // don't end up with wrong granularity due to small shifts or delays
    return oneMinute;
  }
  return oneHour;
}
