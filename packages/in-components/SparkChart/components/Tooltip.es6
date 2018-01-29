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

    componentDidMount() {
      this.onMouseMoveSubscription = on(this.glassPane, 'mousemove').subscribe(this.onMouseMove);
      this.onMouseLeaveSubscription = on(this.glassPane, 'mouseleave').subscribe(this.onMouseLeave);

      this.updateScaleFromProps(this.props);
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
          <div
            className={locals.tooltip}
            style={{
              left: xPositionOnCanvas
            }}
          >
            {nearestDataPoint ? <div className={locals.line} /> : null}
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
            className={locals.glassPane}
            ref={glassPane => {
              this.glassPane = glassPane;
            }}
          />
        </div>
      );
    }

    updateScaleFromProps({ timeframe }) {
      this.xScale.setRangeFrom(2);
      this.xScale.setRangeTo(98);
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
      setHighlightedMoment(this.xScale.getDomain(e.offsetX));
      this.setState({
        yPositionOnCanvas: e.offsetY - 14
      });
    };

    onMouseLeave = () => {
      this.setState({
        yPositionOnCanvas: 0
      });
      clearHighlightedMoment();
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

    cursorHasCrossedHalfOfTheCanvas(cursorXPosition) {
      const fullWidth = this.xScale.getRangeTo() - this.xScale.getRangeFrom();
      return cursorXPosition > fullWidth / 2;
    }
  }
);
