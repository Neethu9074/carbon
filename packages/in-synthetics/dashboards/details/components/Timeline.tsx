/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { TestResultSubtransaction } from '@instana/types/typeDefinitions';
import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import { isOverlappedWith } from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/TimeRangeHelper';
// @ts-expect-error Module needs to be translated to TS
import HorizontalAxis from 'in-components/Axis/HorizontalAxis';
import { OverviewChartToolTipProps, ResultDetailsResponse, SubtransactionsProps } from 'in-synthetics/utils/constants';
import SubtransactionsList from 'in-synthetics/dashboards/details/components/SubtransactionsList';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { millis, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip/Tooltip';
import createScale from 'in-services/scale/scale';
import theme from 'in-themes';

import locals from './Timeline.mless';

const barHeight = 8;

interface TimelineProps {
  details: ResultDetailsResponse;
}

export default function Timeline({ details }: TimelineProps) {
  const { errors, data } = details;
  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.timeLineWidget')}>
      <div className={locals.overviewChartContainer}>
        <OverviewChart errors={errors} data={data} />
      </div>
      <SubtransactionsList errors={errors} data={data} />
    </Card>
  );
}

function OverviewChart({ errors, data }: SubtransactionsProps) {
  const { width, ref } = useResizeObserverCustom();

  if (errors?.length != undefined && data != undefined) {
    // @ts-expect-error
    if (errors.length > 0 || data?.subtransactions[0].properties === null) {
      return (
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.detailsPage.noDataAvailable.timelineDescription')}
        />
      );
    }
  }

  const scale = createScale();
  const subData = data?.subtransactions;
  const subStacked = applyLayout(subData);
  // @ts-expect-error
  const earliestTimestamp = subData[0].properties.startTime;
  const endTimestamp = subData?.reduce(
    (max: number, sub: TestResultSubtransaction) => Math.max(max, sub.properties.finishTime + sub.metrics.responseTime),
    0
  );
  let totalDuration = 0;

  subData?.map((subtransaction: TestResultSubtransaction) => {
    totalDuration += subtransaction.metrics.responseTime;
  });

  scale.setRangeFrom(0);
  scale.setRangeTo(1);
  scale.setDomainFrom(earliestTimestamp);
  // @ts-expect-error
  scale.setDomainTo(endTimestamp);

  const maxDepth = subStacked?.reduce((max: number, sub: any) => Math.max(max, sub.depth), 0);
  // @ts-expect-error
  const chartHeight = (maxDepth + 1) * barHeight;

  return (
    // @ts-expect-error
    <div ref={ref}>
      {// @ts-expect-error
      width && subData.length > 0 && (
        <HorizontalAxis
          align="top"
          width={width}
          formatter={millis.forcedCompactOnMs}
          detailedFormatting
          tickLength={8}
          tickColor={theme.lib.colors.N800Dark}
          tickLabelColor={theme.lib.colors.N800Dark}
          scale={{ from: 0, to: totalDuration }}
          fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        />
      )}

      <div className={locals.subtransactions} style={{ height: `${chartHeight}px` }}>
        {subStacked?.map(({ sub, depth }: any) => {
          const startX = scale.getRange(sub.properties.startTime);
          const endX = scale.getRange(sub.properties.startTime + Math.floor(sub.metrics.responseTime));
          const startY = depth;
          return (
            <Tooltip
              themeStyle="light"
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
}

function OverviewChartToolTip({ subtransaction }: OverviewChartToolTipProps) {
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
}

function applyLayout(subData?: TestResultSubtransaction[]) {
  const occupiedTimeRangesByDepth: [] = [];

  const result = subData?.map((sub: TestResultSubtransaction) => {
    const depth = findDepth(
      [sub.properties.startTime, sub.properties.startTime + Math.floor(sub.metrics.responseTime * 1000)],
      occupiedTimeRangesByDepth
    );
    return {
      sub,
      depth
    };
  });

  return result;
}

function findDepth(timeRange: unknown, occupiedTimeRangesByDepth: []) {
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
}
