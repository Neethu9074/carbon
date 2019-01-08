import React from 'react';

import { types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import getElementDimensions from 'in-hoc/getElementDimensions.es6';
import { updateCanvasDimensions } from 'in-charts/canvas';
import createScale from 'in-charts/scale';

import locals from './OverviewChart.mless';

export default getElementDimensions(
  class OverviewChart extends React.Component {
    beacons = this.props.beacons;

    scale = createScale();
    start = this.props.earliestTimestamp;
    endTimestamp = findEndTimestamp(this.beacons);

    render() {
      this.scale.setRangeFrom(0);
      this.scale.setRangeTo(this.props.width);
      this.scale.setDomainFrom(this.start);
      this.scale.setDomainTo(this.endTimestamp);

      return (
        <canvas
          className={locals.canvas}
          ref={canvas => {
            this.canvas = canvas;
          }}
        />
      );
    }

    componentDidUpdate() {
      if (this.canvas && this.props.width) {
        const ctx = this.canvas.getContext('2d');
        updateCanvasDimensions(this.canvas, ctx, this.props.width, this.props.beacons.length * 8 + 2);

        for (let i = 0; i < this.props.beacons.length; i++) {
          const typeDefinition = types[this.props.beacons[i].resourceType];

          var startX = this.scale.getRange(this.props.beacons[i].timestamp);
          var endX = this.scale.getRange(this.props.beacons[i].timestamp + this.props.beacons[i].duration);

          ctx.fillStyle = typeDefinition.color;
          ctx.fillRect(startX, i * 8 + 1, endX - startX, 3);
        }
      }
    }
  }
);

function findEndTimestamp(beacons) {
  var max = 0;
  for (var i = 0; i < beacons.length; i++) {
    if (beacons[i].timestamp + beacons[i].duration > max) {
      max = beacons[i].timestamp + beacons[i].duration;
    }
  }
  return max;
}
