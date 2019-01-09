import React, { Fragment } from 'react';

import { types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { millis } from 'in-services/formatters/number';
import createScale from 'in-charts/scale';
import theme from 'in-themes';

import locals from './OverviewChart.mless';

export default getElementDimensions(function OverviewChart({ beacons, earliestTimestamp, width }) {
  const scale = createScale();
  const endTimestamp = findEndTimestamp(beacons);

  scale.setRangeFrom(0);
  scale.setRangeTo(1);
  scale.setDomainFrom(earliestTimestamp);
  scale.setDomainTo(endTimestamp);

  return (
    <Fragment>
      {width && (
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

      <div className={locals.beacons}>
        {beacons.map((beacon, i) => {
          const typeDefinition = types[beacons[i].resourceType];

          var startX = scale.getRange(beacons[i].timestamp);
          var endX = scale.getRange(beacons[i].timestamp + beacons[i].duration);

          return (
            <div
              className={locals.beacon}
              style={{
                top: i * 8 + 1,
                left: `${startX * 100}%`,
                width: `${(endX - startX) * 100}%`,
                backgroundColor: typeDefinition.color
              }}
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
