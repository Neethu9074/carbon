/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { themes } from '@instana/design-tokens';

// @ts-expect-error Module needs to be translated to TS
import HorizontalAxis from 'in-components/Axis/HorizontalAxis';
import { getType, types } from 'in-synthetics/utils/browserFileTypes';
import { TestResultEntry } from 'in-synthetics/utils/constants';
import { millis } from 'in-services/formatters/number';
import createScale from 'in-services/scale/scale';

import local from 'in-synthetics/dashboards/details/components/browser/BrowserTimeline.mless';

interface BrowserTimelineProps {
  width: number;
  entriesToRender: TestResultEntry[];
  earliestTimestamp: number;
  endTimestamp: number;
}

interface OverviewChartProps {
  width: number;
  entries?: TestResultEntry[];
  earliestTimestamp?: number;
  endTimestamp?: number;
}

const BrowserTimeline = ({ width, entriesToRender, earliestTimestamp, endTimestamp }: BrowserTimelineProps) => {
  return (
    <OverviewChart
      width={width}
      entries={entriesToRender}
      earliestTimestamp={earliestTimestamp}
      endTimestamp={endTimestamp}
    />
  );
};

const OverviewChart = ({ width, entries, earliestTimestamp, endTimestamp }: OverviewChartProps) => {
  const scale = createScale();

  // Domain should be from(min of our data) to (max of our data)
  scale.setDomainFrom(earliestTimestamp || 0);
  scale.setDomainTo(endTimestamp || 0);

  // This range represents a 1 minute period in length axis
  scale.setRangeFrom(0);
  scale.setRangeTo(1);

  return (
    <div className={local.timelineContainer} data-testid="timeline-container">
      <HorizontalAxis
        align="top"
        width={width}
        formatter={millis.forcedCompactOnMs}
        detailedFormatting
        tickColor={themes.default.ids.color.option.neutral['800']}
        tickLabelColor={themes.default.ids.color.option.neutral['800']}
        scale={{ from: earliestTimestamp || 0, to: (endTimestamp || 0) - (earliestTimestamp || 0) }}
        fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      />
      <div className={local.entries} style={{ maxWidth: width }}>
        {entries?.map((entry: TestResultEntry) => {
          const startingPointInTime = new Date(entry.startedDateTime).getTime();
          const startX = scale.getRange(startingPointInTime);
          const endX = scale.getRange(startingPointInTime + Math.floor(entry.time));
          const type = getType(entry.response.content.type?.toLowerCase());
          //@ts-expect-error No index signature found
          const typeDefinition = types[type];
          return (
            <div
              className={local.entry}
              key={generateUniqueShortId()}
              style={{
                backgroundColor: typeDefinition.color,
                top: 2,
                left: `${Math.max(0, startX) * 100}%`,
                width: `${(endX - startX) * 100}%`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BrowserTimeline;
