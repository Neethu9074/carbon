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

  componentDidMount() {
    this.onMouseMoveSubscription = on(this.glassPane, 'mousemove').subscribe(this.onMouseMove);
    this.onMouseLeaveSubscription = on(this.glassPane, 'mouseleave').subscribe(this.onMouseLeave);

    this.xScale.setDomainFrom(this.props.timeframe.to - this.props.timeframe.windowSize);
    this.xScale.setDomainTo(this.props.timeframe.to);
    this.xScale.setRangeFrom(2);
    this.xScale.setRangeTo(98);
  }

  componentWillUnmount() {
    this.onMouseMoveSubscription.dispose();
    this.onMouseMoveSubscription = null;
    this.onMouseLeaveSubscription.dispose();
    this.onMouseLeaveSubscription = null;
  }

  render() {
    return (
      <div>
        <div
          className={locals.tooltip}
          style={{
            left: this.state.xPositionOnCanvas
          }}
        >
          {this.state.isVisible ? <div className={locals.line} /> : null}
          {this.state.isVisible ? (
            <div
              style={{
                marginTop: this.state.yPositionOnCanvas
              }}
            >
              <Badge>{this.props.formatter.detailed(this.state.nearestDataPoint[1])}</Badge>
            </div>
          ) : null}
        </div>

        <div
          className={locals.glassPane}
          ref={glassPane => {
            this.glassPane = glassPane;
          }}
        />
      </div>
    );
  }

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
