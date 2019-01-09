import React from 'react';

import { types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import getElementDimensions from 'in-hoc/getElementDimensions.es6';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import { updateCanvasDimensions } from 'in-charts/canvas';
import { millis } from 'in-services/formatters/number';
import createScale from 'in-charts/scale';
import theme from 'in-themes';

import locals from './OverviewChart.mless';

export default getElementDimensions(
  class OverviewChart extends React.Component {
    render() {
      const startTimestamp = this.props.earliestTimestamp;
      const endTimestamp = findEndTimestamp(this.props.beacons);

      return (
        <div>
          {this.props.width && (
            <HorizontalAxis
              align="top"
              width={this.props.width}
              formatter={millis}
              detailedFormatting
              tickLength={8}
              tickColor={theme.lib.colors.N400}
              tickLabelColor={theme.lib.colors.N800Dark}
              scale={{ from: 0, to: endTimestamp - startTimestamp }}
              fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            />
          )}
          <canvas
            className={locals.canvas}
            ref={canvas => {
              this.canvas = canvas;
            }}
          />
        </div>
      );
    }

    componentDidUpdate() {
      const { beacons } = this.props;
      const scale = createScale();
      const startTimestamp = this.props.earliestTimestamp;
      const endTimestamp = findEndTimestamp(this.props.beacons);

      scale.setRangeFrom(0);
      scale.setRangeTo(this.props.width);
      scale.setDomainFrom(startTimestamp);
      scale.setDomainTo(endTimestamp);

      if (this.canvas && this.props.width) {
        const ctx = this.canvas.getContext('2d');
        updateCanvasDimensions(this.canvas, ctx, this.props.width, beacons.length * 8 + 2);

        for (let i = 0; i < beacons.length; i++) {
          const typeDefinition = types[beacons[i].resourceType];

          var startX = scale.getRange(beacons[i].timestamp);
          var endX = scale.getRange(beacons[i].timestamp + beacons[i].duration);

          ctx.fillStyle = typeDefinition.color;
          ctx.fillRect(startX, i * 8 + 1, endX - startX, 3);
        }
      }
    }
  }
);

function findEndTimestamp(beacons) {
  var max = 0;
  beacons.forEach(beacon => {
    if (beacon.timestamp + beacon.duration > max) {
      max = beacon.timestamp + beacon.duration;
    }
  });
  return max;
}
