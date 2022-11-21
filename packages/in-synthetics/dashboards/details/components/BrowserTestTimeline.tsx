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
//import Filter from 'in-synthetics/dashboards/details/components/Filter';
import { getType, types } from 'in-synthetics/utils/browserFileTypes';
// @ts-expect-error Module needs to be translated to TS
import HorizontalAxis from 'in-components/Axis/HorizontalAxis';
import { ResultDetailsResponse, TestResultEntry, TestResultHARPage } from 'in-synthetics/utils/constants';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import EntriesList from 'in-synthetics/dashboards/details/components/EntriesList';
import { millis, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip/Tooltip';
import createScale from 'in-services/scale/scale';
import theme from 'in-themes';

import locals from 'in-synthetics/dashboards/details/components/BrowserTestTimeline.mless';

const barHeight = 8;
const defaultPage = 'page_x0';

interface TimelineProps {
  details: ResultDetailsResponse;
  startTime: number;
  finishTime: number;
}

interface EntriesProps {
  entries?: TestResultEntry[];
  earliestTimestamp?: number;
  endTimestamp?: number;
}

interface OverviewChartToolTipProps {
  entry: TestResultEntry;
}

export default function BrowserTestTimeline({ details, startTime, finishTime }: TimelineProps) {
  //const [filter, setFilter] = useState({ query: '', type: 'ALL' });
  const [expanded, setExpanded] = useState(defaultPage);

  const { data } = details;

  const entriesToRender = data?.har?.log.entries.filter((entry: TestResultEntry) => {
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

  // let filteredEntries = entriesToRender.filter((entry: TestResultEntry) => {
  //   if (filter.query === '') {
  //     return entry;
  //   } else if (entry.response.content.mimeType.split("/")[0].toLowerCase().includes(filter.query.toLowerCase())) {
  //     return entry;
  //   }
  // });

  // filteredEntries = filteredEntries?.filter((filteredEntry: TestResultEntry) => {
  //   if (filter.type === 'TEXT') {
  //     return filteredEntry.response.content.mimeType.split("/")[0].toLowerCase() === getOperation.toLowerCase();
  //   } else if (filter.type === 'OTHERS') {
  //     return filteredEntry.response.content.mimeType.split("/")[0].toLowerCase() !== getOperation.toLowerCase();
  //   } else {
  //     return filteredEntry;
  //   }
  // });

  return (
    <Card title={t('in-synthetics:dashboard.detailsPage.timeLineWidget')}>
      {data != undefined && data != null ? (
        <>
          {/* <Filter setFilter={setFilter} filter={filter} /> */}
          <div className={locals.overviewChartContainer}>
            {entriesToRender.length > 0 && entriesToRender[0].timings != null && (
              <OverviewChart entries={entriesToRender} earliestTimestamp={startTime} endTimestamp={finishTime} />
            )}
          </div>
          <EntriesList
            entries={data?.har?.log.entries}
            pages={pagesToMap}
            expanded={expanded}
            setExpanded={setExpanded}
          />
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
          const mimeType: string = entry.response.content.mimeType.split('/')[1];
          const type = getType(mimeType != undefined ? mimeType : 'x-unknown');
          // @ts-expect-error
          const typeDefinition = types[type];
          const msTime = new Date(entry.startedDateTime).getTime();
          const startX = scale.getRange(msTime);
          const endX = scale.getRange(msTime + Math.floor(entry.time));
          const startY = depth;
          return (
            <Tooltip
              themeStyle="light"
              content={<OverviewChartToolTip entry={entry} />}
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

function OverviewChartToolTip({ entry }: OverviewChartToolTipProps) {
  return (
    <div className={locals.tooltipWrapper}>
      <div className={locals.labelRow}>
        <span className={locals.label}>{entry._resourceType}</span>
      </div>

      <dl className={locals.timings}>
        <div className={locals.timing}>
          <dt className={locals.key}>{t('in-synthetics:dashboard.detailsPage.responseTimeChart')}</dt>
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
