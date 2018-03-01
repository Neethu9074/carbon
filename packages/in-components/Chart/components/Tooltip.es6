import { on } from 'reactive-observables';
import React from 'react';

import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment } from 'in-stores/timeline';
import ApplyTimeframeButtons from 'in-components/Chart/components/ApplyTimeframeButtons';
import HighlightedTimeframe from 'in-components/Chart/components/HighlightedTimeframe';
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

    state = {
      xScale: createScale(),
      shouldRenderButtons: false
    };

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
        <div className={`${locals.tooltip} ${this.props.alignment === 'top' ? locals.top : locals.bottom}`}>
          <HighlightedTimeframe
            xScale={this.state.xScale}
            glassPane={this.glassPane}
            shouldRenderButtons={this.shouldRenderButtons}
          />
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
          {this.state.shouldRenderButtons && <ApplyTimeframeButtons xScale={this.state.xScale} />}
        </div>
      );
    }

    setupSubsriptions = () => {
      this.onMouseMoveSubscription = on(this.glassPane, 'mousemove').subscribe(this.onMouseMove.bind(this));
      this.onMouseLeaveSubscription = on(this.glassPane, 'mouseleave').subscribe(this.onMouseLeave.bind(this));
    };

    disposeSubscriptions = () => {
      this.onMouseMoveSubscription.dispose();
      this.onMouseMoveSubscription = null;
      this.onMouseLeaveSubscription.dispose();
      this.onMouseLeaveSubscription = null;
    };

    updateScale() {
      const config = this.props.chart.config;
      this.state.xScale.setRangeFrom(0);
      this.state.xScale.setRangeTo(this.glassPane.clientWidth);
      this.state.xScale.setDomainFrom(config.timeframe.to - config.timeframe.windowSize);
      this.state.xScale.setDomainTo(config.timeframe.to);
      this.setState({ xScale: this.state.xScale });
    }

    onMouseMove = e => {
      if (e.offsetX >= this.state.xScale.getRangeFrom() && e.offsetX <= this.state.xScale.getRangeTo()) {
        setHighlightedMoment(this.state.xScale.getDomain(e.offsetX));
      }
    };

    onMouseLeave = () => clearHighlightedMoment();

    getNearestDomain = () => {
      const time = this.props.highlightedMoment;
      if (time < this.state.xScale.getDomainFrom() || time > this.state.xScale.getDomainTo()) {
        return null;
      }

      return this.props.chart.getNearestDataPointDomainForTimestamp(time);
    };

    getNearestDomainXPosition = nearestTimeInMetrics => {
      return nearestTimeInMetrics
        ? this.state.xScale.getRange(nearestTimeInMetrics) - this.state.xScale.getRangeFrom()
        : null;
    };

    cursorHasCrossedHalfOfTheCanvas(cursorXPosition) {
      const fullWidth = this.state.xScale.getRangeTo() - this.state.xScale.getRangeFrom();
      return cursorXPosition > fullWidth / 2;
    }

    shouldRenderButtons = b => {
      if (this.state.shouldRenderButtons !== b) {
        this.setState({ shouldRenderButtons: b });
      }
    };
  }
);
