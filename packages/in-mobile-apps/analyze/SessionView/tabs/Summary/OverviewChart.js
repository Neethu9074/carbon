/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import OverviewChartTooltip from 'in-mobile-apps/analyze/SessionView/tabs/Summary/OverviewChartTooltip';
import { isOverlappedWith } from 'in-analyze/TraceDetail/components/IcicleChart/TimeRangeHelper';
import { getType, types } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/filterableTypes';
import { getHighlighterId } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { millis } from 'in-services/formatters/number';
import { deepFreeze } from 'in-services/util/object';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-services/scale';
import theme from 'in-themes';

import locals from './OverviewChart.mless';

const barHeight = 8;

export default getElementDimensions(function OverviewChart({ beacons, earliestTimestamp, width, endTimestamp }) {
  const scale = createScale();
  const beaconsStacked = applyLayout(beacons, earliestTimestamp, endTimestamp);

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
        {beaconsStacked.map((beacon, i) => {
          const type = getType(beacon);
          const typeDefinition = types[type];
          const startX = scale.getRange(beaconsStacked[i].timestamp);
          const endX = scale.getRange(beaconsStacked[i].timestamp + beaconsStacked[i].duration);
          const startY = beaconsStacked[i].depth;

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
                  // There's problems with some requests starting before the session, this sets their startX to 0
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
  return deepFreeze(positionBeacons(beacons, 0, []));
}

function positionBeacons(beacons, depth, occupiedTimeRangesByDepth) {
  let stackedBeacons = [];
  beacons.map(beacon => {
    const end = beacon.timestamp + beacon.duration;
    const depthWithoutOverlapping = findDepthWithoutAnyOverlapping(
      depth,
      [beacon.timestamp, end],
      occupiedTimeRangesByDepth
    );
    const beaconWithDepth = {
      ...beacon,
      depth: depthWithoutOverlapping
    };
    stackedBeacons.push(beaconWithDepth);
  });
  return stackedBeacons;
}

function findDepthWithoutAnyOverlapping(minDepth, timeRange, occupiedTimeRangesByDepth) {
  const start = timeRange[0];
  const end = timeRange[1];

  let depth = minDepth;

  for (let d = minDepth; ; d++) {
    if (!isOverlappedWith([start, end], occupiedTimeRangesByDepth[d])) {
      depth = d;
      break;
    }
  }

  if (!occupiedTimeRangesByDepth[depth]) {
    occupiedTimeRangesByDepth[depth] = [];
  }
  occupiedTimeRangesByDepth[depth].push([start, end]);

  return depth;
}
