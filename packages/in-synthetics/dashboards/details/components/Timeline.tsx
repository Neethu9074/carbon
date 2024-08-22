/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { isEmpty } from 'lodash';

import { TestResultSubtransaction } from '@instana/types/typeDefinitions';
import { themes } from '@instana/design-tokens';
import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import { isOverlappedWith } from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/TimeRangeHelper';
import {
  getOperation,
  OverviewChartToolTipProps,
  ResultDetailsResponse,
  SubtransactionsProps
} from 'in-synthetics/utils/constants';
// @ts-expect-error Module needs to be translated to TS
import HorizontalAxis from 'in-components/Axis/HorizontalAxis';
import SubtransactionsList from 'in-synthetics/dashboards/details/components/SubtransactionsList';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { millis, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import Filter from 'in-synthetics/dashboards/details/components/Filter';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip/Tooltip';
import createScale from 'in-services/scale/scale';

import locals from 'in-synthetics/dashboards/details/components/Timeline.mless';

const barHeight = 8;

interface TimelineProps {
  details: ResultDetailsResponse;
  startTime: number;
  finishTime: number;
}

const Timeline = ({ details, startTime, finishTime }: TimelineProps) => {
  const [filter, setFilter] = useState({ query: '', type: 'ALL' });

  const { data } = details;
  // @ts-expect-error
  let filteredSubtransactions = data?.subtransactions?.filter(subtransaction => {
    if (filter.query === '') {
      return subtransaction;
    } else if (subtransaction.metrics.httpOperation.toLowerCase().includes(filter.query.toLowerCase())) {
      return subtransaction;
    }
  });

  filteredSubtransactions = filteredSubtransactions?.filter(filteredSubtransaction => {
    if (filter.type === 'GET') {
      return filteredSubtransaction.metrics.httpOperation.toLowerCase() === getOperation.toLowerCase();
    } else if (filter.type === 'OTHERS') {
      return filteredSubtransaction.metrics.httpOperation.toLowerCase() !== getOperation.toLowerCase();
    } else {
      return filteredSubtransaction;
    }
  });

  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.timeLineWidget')}>
      {data != undefined && data != null && !isEmpty(data) ? (
        <>
          <Filter setFilter={setFilter} filter={filter} />
          <div className={locals.overviewChartContainer}>
            {
              // @ts-expect-error Object is possibly undefined
              data?.subtransactions?.length > 0 && data?.subtransactions[0]?.properties != null && (
                <OverviewChart
                  subtransactions={filteredSubtransactions}
                  earliestTimestamp={startTime}
                  endTimestamp={finishTime}
                />
              )
            }
          </div>
          <SubtransactionsList subtransactions={filteredSubtransactions} />
        </>
      ) : (
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.detailsPage.noDataAvailable.message', { component: 'Timeline' })}
        />
      )}
    </Card>
  );
};

const OverviewChart = ({ subtransactions, earliestTimestamp, endTimestamp }: SubtransactionsProps) => {
  const { width, ref } = useResizeObserverCustom();

  const scale = createScale();
  const subStacked = applyLayout(subtransactions);

  scale.setRangeFrom(0);
  scale.setRangeTo(1);
  scale.setDomainFrom(earliestTimestamp || 0);
  scale.setDomainTo(endTimestamp || 0);

  const maxDepth = subStacked?.reduce((max: number, sub: any) => Math.max(max, sub.depth), 0);
  // @ts-expect-error
  const chartHeight = (maxDepth + 1) * barHeight;

  return (
    // @ts-expect-error
    <div ref={ref}>
      {
        // @ts-expect-error
        width && subtransactions.length > 0 && (
          <HorizontalAxis
            align="top"
            width={width}
            formatter={millis.forcedCompactOnMs}
            detailedFormatting
            tickLength={8}
            tickColor={themes.default.ids.color.option.neutral['800']}
            tickLabelColor={themes.default.ids.color.option.neutral['800']}
            // @ts-expect-error
            scale={{ from: earliestTimestamp, to: endTimestamp - earliestTimestamp }}
            fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
          />
        )
      }

      <div className={locals.subtransactions} style={{ height: `${chartHeight}px` }}>
        {subStacked?.map(({ sub, depth }: any) => {
          const startX = scale.getRange(sub.properties.startTime);
          const endX = scale.getRange(sub.properties.startTime + Math.floor(sub.metrics.responseTime));
          const startY = depth;
          return (
            <Tooltip
              themeStyle="light"
              forceTheme
              content={<OverviewChartToolTip subtransaction={sub} />}
              key={sub.properties.currentUUID}
            >
              <div
                className={locals.subtransaction}
                key={sub.properties.currentUUID}
                style={{
                  backgroundColor: 'darkgray',
                  // @ts-expect-error
                  top: `${startY}` * barHeight + 1,
                  left: `${Math.max(0, startX) * 100}%`,
                  width: `${(endX - startX) * 100}%`
                }}
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

const OverviewChartToolTip = ({ subtransaction }: OverviewChartToolTipProps) => {
  return (
    <div className={locals.tooltipWrapper}>
      <div className={locals.labelRow}>
        <span className={locals.label}>{subtransaction.metrics.httpOperation}</span>
      </div>

      <dl className={locals.timings}>
        <div className={locals.timing}>
          <dt className={locals.key}>{t('in-synthetics:dashboard.detailsPage.responseTimeChart')}</dt>
          <dd className={locals.value}>{millisToTwoDecimalSeconds(subtransaction.metrics.responseTime)}</dd>
        </div>
      </dl>
    </div>
  );
};

const applyLayout = (subData?: TestResultSubtransaction[]) => {
  const occupiedTimeRangesByDepth: [] = [];

  return subData?.map((sub: TestResultSubtransaction) => {
    const depth = findDepth(
      [sub.properties.startTime, sub.properties.startTime + Math.floor(sub.metrics.responseTime * 1000)],
      occupiedTimeRangesByDepth
    );
    return {
      sub,
      depth
    };
  });
};

const findDepth = (timeRange: unknown, occupiedTimeRangesByDepth: []) => {
  for (let depth = 0; ; depth++) {
    if (!isOverlappedWith(timeRange, occupiedTimeRangesByDepth[depth])) {
      if (!occupiedTimeRangesByDepth[depth]) {
        // @ts-expect-error
        occupiedTimeRangesByDepth[depth] = [];
      }
      // @ts-expect-error
      occupiedTimeRangesByDepth[depth].push(timeRange);
      return depth;
    }
  }
};

export default Timeline;
