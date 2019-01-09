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
    beacons = this.props.beacons;

    scale = createScale();
    startTimestamp = this.props.earliestTimestamp;
    endTimestamp = findEndTimestamp(this.beacons);

    render() {
      this.scale.setRangeFrom(0);
      this.scale.setRangeTo(this.props.width);
      this.scale.setDomainFrom(this.startTimestamp);
      this.scale.setDomainTo(this.endTimestamp);

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
              scale={{ from: 0, to: this.endTimestamp - this.startTimestamp }}
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
      if (this.canvas && this.props.width) {
        const ctx = this.canvas.getContext('2d');
        updateCanvasDimensions(this.canvas, ctx, this.props.width, this.beacons.length * 8 + 2);

        for (let i = 0; i < this.beacons.length; i++) {
          const typeDefinition = types[this.beacons[i].resourceType];

          var startX = this.scale.getRange(this.beacons[i].timestamp);
          var endX = this.scale.getRange(this.beacons[i].timestamp + this.beacons[i].duration);

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
