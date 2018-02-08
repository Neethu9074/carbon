import { on } from 'reactive-observables';
import React from 'react';

import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment } from 'in-stores/timeline';
import TooltipContent from 'in-components/Chart/components/TooltipContent';
import { evaluateClassNames } from 'in-services/util/classnames';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';

import locals from './Tooltip.mless';

export default connectTo(
  {
    highlightedMoment: highlightedMoment$
  },
  class extends React.Component {
    static displayName = 'Tooltip';

    xScale = createScale();

    componentDidMount() {
      this.updateScale();
      this.setupSubsriptions();
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    render() {
      const nearestTimeInMetrics = this.getNearestDomain();
      const cursorXPositionOnCanvas = this.getNearestDomainXPosition(nearestTimeInMetrics);

      return (
        <div className={locals.tooltip}>
          {cursorXPositionOnCanvas ? (
            <div
              className={locals.line}
              style={{
                left: cursorXPositionOnCanvas
              }}
            >
              <div
                className={evaluateClassNames({
                  [locals.content]: true,
                  [locals.leftAlignedContent]: this.cursorHasCrossedHalfOfTheCanvas(cursorXPositionOnCanvas)
                })}
              >
                <TooltipContent timestamp={nearestTimeInMetrics} chart={this.props.chart} />
              </div>
            </div>
          ) : null}
          <div
            ref={glassPane => {
              this.glassPane = glassPane;
            }}
            className={locals.glassPane}
          />
        </div>
      );
    }

    setupSubsriptions = () => {
      this.onMouseMoveSubscription = on(this.glassPane, 'mousemove').subscribe(this.onMouseMove);
      this.onMouseLeaveSubscription = on(this.glassPane, 'mouseleave').subscribe(this.onMouseLeave);
    };

    disposeSubscriptions = () => {
      this.onMouseMoveSubscription.dispose();
      this.onMouseMoveSubscription = null;
      this.onMouseLeaveSubscription.dispose();
      this.onMouseLeaveSubscription = null;
    };

    updateScale() {
      const config = this.props.chart.config;
      this.xScale.setRangeFrom(0);
      this.xScale.setRangeTo(this.glassPane.clientWidth);
      this.xScale.setDomainFrom(config.timeframe.to - config.timeframe.windowSize);
      this.xScale.setDomainTo(config.timeframe.to);
    }

    onMouseMove = e => {
      if (e.offsetX >= this.xScale.getRangeFrom() && e.offsetX <= this.xScale.getRangeTo()) {
        setHighlightedMoment(this.xScale.getDomain(e.offsetX));
      }
    };

    onMouseLeave = () => clearHighlightedMoment();

    getNearestDomain = () => {
      const time = this.props.highlightedMoment;
      if (time < this.xScale.getDomainFrom() || time > this.xScale.getDomainTo()) {
        return null;
      }

      return this.props.chart.getNearestDataPointDomainForTimestamp(time);
    };

    getNearestDomainXPosition = nearestTimeInMetrics => {
      return nearestTimeInMetrics ? this.xScale.getRange(nearestTimeInMetrics) - this.xScale.getRangeFrom() : null;
    };

    cursorHasCrossedHalfOfTheCanvas(cursorXPosition) {
      const fullWidth = this.xScale.getRangeTo() - this.xScale.getRangeFrom();
      return cursorXPosition > fullWidth / 2;
    }
  }
);
