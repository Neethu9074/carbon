/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import { isOverlappedWith } from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/TimeRangeHelper';
// @ts-expect-error Module needs to be translated to TS
import HorizontalAxis from 'in-components/Axis/HorizontalAxis';
import { defaultPage, ResultDetailsResponse, TestResultEntry, TestResultHARPage } from 'in-synthetics/utils/constants';
import { getFilterType, getType, types } from 'in-synthetics/utils/browserFileTypes';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import EntriesList from 'in-synthetics/dashboards/details/components/EntriesList';
import { millis, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import Filter from 'in-synthetics/dashboards/details/components/Filter';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip/Tooltip';
import createScale from 'in-services/scale/scale';
import Pill from 'in-components/Pill';
import theme from 'in-themes';

import locals from 'in-synthetics/dashboards/details/components/BrowserTestTimeline.mless';

const barHeight = 8;

interface TimelineProps {
  details: ResultDetailsResponse;
  startTime: number;
  finishTime: number;
  isBrowserType: boolean;
}

interface EntriesProps {
  entries?: TestResultEntry[];
  earliestTimestamp?: number;
  endTimestamp?: number;
}

interface OverviewChartToolTipProps {
  entry: TestResultEntry;
  type: string;
}

export default function BrowserTestTimeline({ details, startTime, finishTime, isBrowserType }: TimelineProps) {
  const [filter, setFilter] = useState({ query: '', type: '' });
  const [expanded, setExpanded] = useState(defaultPage);

  const { data } = details;

  let filteredEntries: TestResultEntry[] = data?.har?.log.entries.filter((entry: TestResultEntry) => {
    const type: string = getFilterType(entry.response.content.type.toLowerCase()).toLowerCase();
    if (filter.type && !type.includes(filter.type.toLowerCase())) {
      return false;
    }
    if (filter.query && !type.includes(filter.query.toLowerCase())) {
      return false;
    }
    return true;
  });

  const entriesToRender: TestResultEntry[] = filteredEntries.filter((entry: TestResultEntry) => {
    return entry.pageref === expanded ? entry : null;
  });

  const pagesToMap = new Map(
    data?.har?.log.pages.map((page: TestResultHARPage) => [
      page.id,
      {
        url: page._url || '',
        totalTime: page.pageTimings.totalTime || 0,
        totalResponseSize: page.totalResponseSize || 0
      }
    ])
  );

  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.timeLineWidget')}>
      {data != undefined && data != null ? (
        <>
          <Filter setFilter={setFilter} filter={filter} isBrowserType={isBrowserType} setExpanded={setExpanded} />
          <div className={locals.overviewChartContainer}>
            {filteredEntries.length >= 0 && (
              <OverviewChart entries={entriesToRender} earliestTimestamp={startTime} endTimestamp={finishTime} />
            )}
          </div>
          <EntriesList entries={filteredEntries} pages={pagesToMap} expanded={expanded} setExpanded={setExpanded} />
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
}

function OverviewChart({ entries, earliestTimestamp, endTimestamp }: EntriesProps) {
  const { width, ref } = useResizeObserverCustom();

  const scale = createScale();
  const subStacked = applyLayout(entries);

  scale.setRangeFrom(0);
  scale.setRangeTo(1);
  scale.setDomainFrom(earliestTimestamp || 0);
  scale.setDomainTo(endTimestamp || 0);

  const maxDepth = subStacked?.reduce((max: number, entry: any) => Math.max(max, entry.depth), 0);
  // @ts-expect-error maxDepth is possibly undefined
  const chartHeight = (maxDepth + 1) * barHeight;

  return (
    // @ts-expect-error RefObject is not assignable to type LegacyRef element
    <div ref={ref}>
      {// @ts-expect-error Entries are possibly undefined
      width && entries.length > 0 && (
        <HorizontalAxis
          align="top"
          width={width}
          formatter={millis.forcedCompactOnMs}
          detailedFormatting
          tickLength={8}
          tickColor={theme.lib.colors.N800Dark}
          tickLabelColor={theme.lib.colors.N800Dark}
          // @ts-expect-error endTimestamp and earliestTimestamp are possibly undefined
          scale={{ from: earliestTimestamp, to: endTimestamp - earliestTimestamp }}
          fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        />
      )}

      <div className={locals.entries} style={{ height: `${chartHeight}px` }}>
        {subStacked?.map(({ entry, depth }: any) => {
          const type = getType(entry.response.content.type.toLowerCase());
          // @ts-expect-error
          const typeDefinition = types[type];
          const msTime = new Date(entry.startedDateTime).getTime();
          const startX = scale.getRange(msTime);
          const endX = scale.getRange(msTime + Math.floor(entry.time));
          const startY = depth;
          return (
            <Tooltip
              themeStyle="light"
              content={<OverviewChartToolTip entry={entry} type={type} />}
              key={entry.serverIPAddress + Math.random()}
            >
              <div
                className={locals.entry}
                key={entry.startedDateTime + Math.random()}
                style={{
                  backgroundColor: typeDefinition.color,
                  // @ts-expect-error left-hand side of the operation is not a number, bigint or any type.
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

function OverviewChartToolTip({ entry, type }: OverviewChartToolTipProps) {
  // @ts-expect-error
  const typeDefinition = types[type];
  return (
    <div className={locals.tooltipWrapper}>
      <div className={locals.labelRow}>
        <Pill color={typeDefinition.color} className={locals.label}>
          {typeDefinition.short}
        </Pill>
      </div>

      <dl className={locals.timings}>
        <div className={locals.timing}>
          <dt className={locals.key}>{`URL`}</dt>
          <dd className={locals.value}>{entry.request.url}</dd>
        </div>
        <div className={locals.timing}>
          <dt className={locals.key}>{t('in-synthetics:dashboard.detailsPage.browserDetails.entry.time')}</dt>
          <dd className={locals.value}>{millisToTwoDecimalSeconds(entry.time)}</dd>
        </div>
      </dl>
    </div>
  );
}

function applyLayout(entryData?: TestResultEntry[]) {
  const occupiedTimeRangesByDepth: [] = [];

  const result = entryData?.map((entry: TestResultEntry) => {
    const msTime = new Date(entry.startedDateTime).getTime();
    const depth = findDepth([msTime, msTime + Math.floor(entry.time * 1000)], occupiedTimeRangesByDepth);
    return {
      entry,
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
