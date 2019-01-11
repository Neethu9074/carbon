import React, { Fragment } from 'react';

import { isOverlappedWith } from 'in-analyze/TraceDetail/components/IcicleChart/TimeRangeHelper';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { millis } from 'in-services/formatters/number';
import { deepFreeze } from 'in-services/util/object';
import createScale from 'in-charts/scale';
import theme from 'in-themes';

import locals from './OverviewChart.mless';

export default getElementDimensions(function OverviewChart({ beacons, earliestTimestamp, width }) {
  const scale = createScale();
  const endTimestamp = findEndTimestamp(beacons);
  const beaconsStacked = applyLayout(beacons, earliestTimestamp, endTimestamp);

  scale.setRangeFrom(0);
  scale.setRangeTo(1);
  scale.setDomainFrom(earliestTimestamp);
  scale.setDomainTo(endTimestamp);

  let maxDepth = 0;

  beaconsStacked.forEach(beacon => {
    maxDepth = Math.max(maxDepth, beacon.depth);
  });

  const chartHeight = (maxDepth + 1) * 10;

  return (
    <Fragment>
      {width &&
        beacons.length > 0 && (
          <HorizontalAxis
            align="top"
            width={width}
            formatter={millis}
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
          const typeDefinition = types[beacons[i].resourceType];

          var startX = scale.getRange(beaconsStacked[i].timestamp);
          var endX = scale.getRange(beaconsStacked[i].timestamp + beaconsStacked[i].duration);
          var startY = beaconsStacked[i].depth;

          return (
            <div
              className={locals.beacon}
              key={beacon.beaconId}
              style={{
                top: `${startY}` * 8 + 1,
                left: `${startX * 100}%`,
                width: `${(endX - startX) * 100}%`,
                backgroundColor: typeDefinition.color
              }}
              onClick={() => triggerHighlight(getHighlighterId(beacon.beaconId))}
            />
          );
        })}
      </div>
    </Fragment>
  );
});

function findEndTimestamp(beacons) {
  var max = 0;
  beacons.forEach(beacon => {
    if (beacon.timestamp + beacon.duration > max) {
      max = beacon.timestamp + beacon.duration;
    }
  });
  return max;
}

function applyLayout(beacons) {
  let beaconsStacked = positionBeacons(beacons, 0, []);

  return deepFreeze(beaconsStacked);
}

function positionBeacons(beacons, depth, occupiedTimeRangesByDepth) {
  let stackedBeacons = [];
  beacons.map(beacon => {
    const end = beacon.timestamp + beacon.duration;
    let depthWithoutOverlapping = findDepthWithoutAnyOverlapping(
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
