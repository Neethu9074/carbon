import { on } from 'reactive-observables';
import React from 'react';

import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment } from 'in-stores/timeline';
import { evaluateClassNames } from 'in-services/util/classnames';
import createScale from 'in-charts/scale';
import Badge from 'in-components/Badge';
import locals from './Tooltip.mless';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    highlightedMoment: highlightedMoment$
  },
  class extends React.Component {
    static displayName = 'Tooltip';

    xScale = createScale();

    state = { yPositionOnCanvas: 0 };

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
      if (nearestDataPoint) {
        xPositionOnCanvas = this.xScale.getRange(nearestDataPoint[0]);
      }

      return (
        <div>
          <div className={locals.tooltip} style={{ left: xPositionOnCanvas }}>
            {nearestDataPoint ? (
              <div
                className={evaluateClassNames({
                  [locals.value]: true,
                  [locals.leftAligned]: this.cursorHasCrossedHalfOfTheCanvas(xPositionOnCanvas)
                })}
                style={{
                  marginTop: this.state.yPositionOnCanvas
                }}
              >
                <Badge>{this.props.tooltipFormatter(nearestDataPoint[1])}</Badge>
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
      this.xScale.setDomainFrom(timeframe.to - timeframe.windowSize);
      this.xScale.setDomainTo(timeframe.to);
    }

    calculateNearestDataPoint() {
      if (!this.props.highlightedMoment) {
        return null;
      }
      return this.getNearestDataPointForXPosition(this.xScale.getRange(this.props.highlightedMoment));
    }

    onMouseMove = e => {
      if (e.offsetX < this.xScale.getRangeFrom() || e.offsetX > this.xScale.getRangeTo()) {
        return;
      }
      setHighlightedMoment(this.xScale.getDomain(e.offsetX));
      this.setState({ yPositionOnCanvas: e.offsetY - 14 });
    };

    onMouseLeave = () => {
      this.setState({ yPositionOnCanvas: 0 });
      clearHighlightedMoment();
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
);
