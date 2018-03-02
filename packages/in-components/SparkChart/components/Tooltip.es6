import { on } from 'reactive-observables';
import React, { Fragment } from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import createScale from 'in-charts/scale';

import locals from './Tooltip.mless';

const tooltipToFocusedMomentMargin = 10;

export default class Tooltip extends React.Component {
  xScale = createScale();

  state = {
    highlightedMoment: null
  };

  componentWillMount() {
    this.updateScaleFromProps(this.props);
  }

  componentDidMount() {
    this.onMouseMoveSubscription = on(this.glassPane, 'mousemove').subscribe(this.onMouseMove);
    this.onMouseLeaveSubscription = on(this.glassPane, 'mouseleave').subscribe(this.onMouseLeave);
  }

  componentWillUpdate(nextProps) {
    this.updateScaleFromProps(nextProps);
  }

  componentWillUnmount() {
    this.onMouseMoveSubscription.dispose();
    this.onMouseMoveSubscription = null;
    this.onMouseLeaveSubscription.dispose();
    this.onMouseLeaveSubscription = null;
  }

  render() {
    const nearestDataPoint = this.calculateNearestDataPoint();
    let xPositionOnCanvas = null;
    let tooltipStyle;
    if (nearestDataPoint) {
      xPositionOnCanvas = this.xScale.getRange(nearestDataPoint[0]);

      if (this.cursorHasCrossedHalfOfTheCanvas(xPositionOnCanvas)) {
        tooltipStyle = {
          top: this.state.highlightedMoment.y,
          right: this.props.width - xPositionOnCanvas + tooltipToFocusedMomentMargin
        };
      } else {
        tooltipStyle = {
          top: this.state.highlightedMoment.y,
          left: xPositionOnCanvas + tooltipToFocusedMomentMargin
        };
      }
    }

    return (
      <div>
        <div className={locals.tooltip} style={tooltipStyle}>
          {nearestDataPoint ? (
            <div className={locals.value}>
              <div className={locals.content}>
                <div className={locals.time}>
                  {this.props.rollup != null && (
                    <Fragment>
                      {formatDateTime(nearestDataPoint[0] - this.props.rollup)}
                      <span className={locals.to}>to</span>
                    </Fragment>
                  )}
                  {formatDateTime(nearestDataPoint[0])}
                </div>
                <span className={locals.value}>
                  {this.props.tooltipFormatter(nearestDataPoint[1])}
                  {this.props.aggregation && <span className={locals.aggregation}>({this.props.aggregation})</span>}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div
          style={{ width: this.xScale.getRangeTo() - this.xScale.getRangeFrom() }}
          className={locals.glassPane}
          ref={glassPane => {
            this.glassPane = glassPane;
          }}
        >
          {nearestDataPoint ? <div className={locals.line} style={{ left: xPositionOnCanvas }} /> : null}
        </div>
      </div>
    );
  }

  updateScaleFromProps({ timeframe, width }) {
    this.xScale.setRangeFrom(2);
    this.xScale.setRangeTo(width - 2);
    const to = timeframe.to || Date.now();
    this.xScale.setDomainFrom(to - timeframe.windowSize);
    this.xScale.setDomainTo(to);
  }

  calculateNearestDataPoint() {
    if (!this.state.highlightedMoment) {
      return null;
    }
    return this.getNearestDataPointForXPosition(this.state.highlightedMoment.x);
  }

  onMouseMove = e => {
    if (e.offsetX < this.xScale.getRangeFrom() || e.offsetX > this.xScale.getRangeTo()) {
      return;
    }

    this.setState({
      highlightedMoment: {
        x: e.offsetX,
        xDomain: this.xScale.getDomain(e.offsetX),
        y: e.offsetY - 14
      }
    });
  };

  onMouseLeave = () => {
    this.setState({
      highlightedMoment: null
    });
  };

  getNearestDataPointForXPosition = xPositionOnCanvas => {
    const metrics = this.props.metrics;
    if (metrics.length === 0) {
      return null;
    }

    const xPositionOnCanvasAsDomain = this.xScale.getDomain(xPositionOnCanvas);
    let distanceToNearestDataPoint = Number.MAX_VALUE;
    let nearestDataPoint = null;

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

  cursorHasCrossedHalfOfTheCanvas(cursorXPosition) {
    const fullWidth = this.xScale.getRangeTo() - this.xScale.getRangeFrom();
    return cursorXPosition > fullWidth / 2;
  }
}
