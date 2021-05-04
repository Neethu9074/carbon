/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { isOverlappedWith } from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/TimeRangeHelper';
import OverviewChartTooltip from 'in-websites/analyze/PageLoadView/tabs/Summary/OverviewChartTooltip';
import { getType, types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { millis } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-services/scale';
import theme from 'in-themes';

import locals from './OverviewChart.mless';

const barHeight = 8;

export default getElementDimensions(function OverviewChart({ beacons, earliestTimestamp, width, endTimestamp }) {
  const scale = createScale();
  const beaconsStacked = applyLayout(beacons);

  scale.setRangeFrom(0);
  scale.setRangeTo(1);
  scale.setDomainFrom(earliestTimestamp);
  scale.setDomainTo(endTimestamp);

  const maxDepth = beaconsStacked.reduce((max, beacon) => Math.max(max, beacon.depth), 0);
  const chartHeight = (maxDepth + 1) * barHeight;

  return (
    <Fragment>
      {width && beacons.length > 0 && (
        <HorizontalAxis
          align="top"
          width={width}
          formatter={millis.forcedCompactOnMs}
          detailedFormatting
          tickLength={8}
          tickColor={theme.lib.colors.N400}
          tickLabelColor={theme.lib.colors.N800Dark}
          scale={{ from: 0, to: endTimestamp - earliestTimestamp }}
          fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        />
      )}

      <div className={locals.beacons} style={{ height: `${chartHeight}px` }}>
        {beaconsStacked.map(({ beacon, depth }) => {
          const type = getType(beacon);
          const typeDefinition = types[type];
          const startX = scale.getRange(beacon.timestamp);
          const endX = scale.getRange(beacon.timestamp + beacon.duration);
          const startY = depth;

          return (
            <Tooltip
              themeStyle="light"
              content={<OverviewChartTooltip earliestTimestamp={earliestTimestamp} beacon={beacon} />}
              key={beacon.beaconId}
            >
              <div
                className={locals.beacon}
                key={beacon.beaconId}
                style={{
                  top: `${startY}` * barHeight + 1,
                  // There's problems with some requests starting before the page load, this sets their startX to 0
                  // to not break the chart.
                  left: `${Math.max(0, startX) * 100}%`,
                  width: `${(endX - startX) * 100}%`,
                  backgroundColor: typeDefinition.color
                }}
                onClick={() => triggerHighlight(getHighlighterId(beacon.beaconId))}
              />
            </Tooltip>
          );
        })}
      </div>
    </Fragment>
  );
});

function applyLayout(beacons) {
  const occupiedTimeRangesByDepth = [];

  const result = beacons.map(beacon => {
    const depth = findDepthWithoutAnyOverlapping(
      [beacon.timestamp, beacon.timestamp + beacon.duration],
      occupiedTimeRangesByDepth
    );
    return {
      beacon,
      depth
    };
  });

  return result;
}

function findDepthWithoutAnyOverlapping(timeRange, occupiedTimeRangesByDepth) {
  for (let depth = 0; ; depth++) {
    if (!isOverlappedWith(timeRange, occupiedTimeRangesByDepth[depth])) {
      if (!occupiedTimeRangesByDepth[depth]) {
        occupiedTimeRangesByDepth[depth] = [];
      }
      occupiedTimeRangesByDepth[depth].push(timeRange);
      return depth;
    }
  }
}
