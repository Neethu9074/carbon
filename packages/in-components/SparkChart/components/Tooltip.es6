import { on } from 'reactive-observables';
import React from 'react';

import createScale from 'in-charts/scale';
import Badge from 'in-components/Badge';
import locals from './Tooltip.mless';

export default class extends React.Component {
  static displayName = 'Tooltip';

  xScale = createScale();

  state = {
    isVisible: false,
    nearestDataPoint: null
  };

  componentWillUpdate(nextProps) {
    if (this.props.glassPane !== nextProps.glassPane) {
      this.disposeSubscriptions();
      this.onMouseMoveSubscription = on(nextProps.glassPane, 'mousemove').subscribe(this.onMouseMove);
      this.onMouseLeaveSubscription = on(nextProps.glassPane, 'mouseleave').subscribe(this.onMouseLeave);

      this.xScale.setDomainFrom(nextProps.timeframe.to - nextProps.timeframe.windowSize);
      this.xScale.setDomainTo(nextProps.timeframe.to);
      this.xScale.setRangeFrom(0);
      this.xScale.setRangeTo(100);
    }
  }

  componentWillUnmount() {
    this.disposeSubscriptions();
  }

  render() {
    if (!this.state.isVisible) {
      return null;
    }

    return (
      <div
        className={locals.tooltip}
        style={{
          left: this.state.xPositionOnCanvas,
          top: this.state.yPositionOnCanvas
        }}
      >
        <Badge>{this.props.formatter.detailed(this.state.nearestDataPoint[1])}</Badge>
      </div>
    );
  }

  disposeSubscriptions = () => {
    if (this.onMouseMoveSubscription) {
      this.onMouseMoveSubscription.dispose();
      this.onMouseMoveSubscription = null;
    }
    if (this.onMouseLeaveSubscription) {
      this.onMouseLeaveSubscription.dispose();
      this.onMouseLeaveSubscription = null;
    }
  };

  onMouseMove = e => {
    const nearestDataPoint = this.getNearestDataPointForXPosition(e.offsetX);
    if (!nearestDataPoint) {
      this.setState({
        isVisible: false
      });
      return;
    }

    this.setState({
      isVisible: true,
      xPositionOnCanvas: this.xScale.getRange(nearestDataPoint[0]) + 4,
      yPositionOnCanvas: e.offsetY - 14,
      nearestDataPoint
    });
  };

  onMouseLeave = () => {
    this.setState({ isVisible: false });
  };

  getNearestDataPointForXPosition = xPositionOnCanvas => {
    const metrics = this.props.metrics;
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const xPositionOnCanvasAsDomain = this.xScale.getDomain(xPositionOnCanvas);
    let nearestDataPoint = null;
    let distanceToNearestDataPoint = Number.MAX_VALUE;

    for (let i = 0; i < metrics.length; i++) {
      const dataPoint = metrics[i];
      const distanceToDataPoint = Math.abs(xPositionOnCanvasAsDomain - dataPoint[0]);
      if (distanceToDataPoint < distanceToNearestDataPoint) {
        nearestDataPoint = dataPoint;
        distanceToNearestDataPoint = distanceToDataPoint;
      }
    }

    return nearestDataPoint;
  };
}
