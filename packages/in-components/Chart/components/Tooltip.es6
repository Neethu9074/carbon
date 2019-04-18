import { on } from 'reactive-observables';
import React from 'react';

import { getAnimationFramesWithAnAnimationDurationOf } from 'in-services/chartRenderingAnimationFrames';
import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment } from 'in-stores/timeline';
import ApplyTimeframeButtons from 'in-components/Chart/components/ApplyTimeframeButtons';
import HighlightedTimeframe from 'in-components/Chart/components/HighlightedTimeframe';
import TooltipContent from 'in-components/Chart/components/TooltipContent';
import { evaluateClassNames } from 'in-services/util/classnames';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';

import locals from './Tooltip.mless';

export default connectTo(
  props => {
    const observables = { highlightedMoment: highlightedMoment$ };
    if (props.timeConfig.autoRefresh) {
      observables['timeSinceLastAnimationDurationPassed'] = getAnimationFramesWithAnAnimationDurationOf(
        props.chart.config.animationDuration
      ).map(({ timeSinceLastAnimationDurationPassed }) => timeSinceLastAnimationDurationPassed);
    }
    return observables;
  },
  class extends React.Component {
    static displayName = 'Tooltip';

    xScale = createScale();

    state = {
      shouldRenderButtons: false
    };

    componentDidMount() {
      this.setupSubsriptions();
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    render() {
      const nearestTimeInMetrics = this.getNearestDomain();
      const cursorXPositionOnCanvas = this.getNearestDomainXPosition(nearestTimeInMetrics);
      const cursorHasCrossedHalfOfTheCanvas = this.cursorHasCrossedHalfOfTheCanvas(cursorXPositionOnCanvas);
      this.updateScale();

      return (
        <div
          className={evaluateClassNames({
            [locals.tooltip]: true,
            [locals.hasY2Axis]: this.props.chart.config.y2
          })}
        >
          <HighlightedTimeframe
            xScale={this.xScale}
            glassPane={this.glassPane}
            shouldRenderButtons={this.shouldRenderButtons}
          />
          {cursorXPositionOnCanvas ? (
            <TooltipLineAndContent
              {...this.props}
              cursorXPositionOnCanvas={cursorXPositionOnCanvas}
              cursorHasCrossedHalfOfTheCanvas={cursorHasCrossedHalfOfTheCanvas}
              nearestTimeInMetrics={nearestTimeInMetrics}
            />
          ) : null}
          <div ref={glassPane => (this.glassPane = glassPane)} className={locals.glassPane} />
          {this.state.shouldRenderButtons && (
            <ApplyTimeframeButtons xScale={this.xScale} metrics={this.props.metrics} />
          )}
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
      this.xScale.setRangeFrom(0);
      this.xScale.setRangeTo(this.props.width);

      this.xScale.setDomainFrom(config.scales.xBackBuffer.getDomainFrom() + config.animationDuration);
      this.xScale.setDomainTo(config.scales.xBackBuffer.getDomainTo());
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
      if (!nearestTimeInMetrics) {
        return null;
      }

      let offset = 0;
      if (this.props.timeSinceLastAnimationDurationPassed) {
        offset = Math.max(
          0,
          this.props.chart.config.animationDuration - (this.props.timeSinceLastAnimationDurationPassed || 0)
        );
      }
      return this.xScale.getRange(nearestTimeInMetrics + offset);
    };

    cursorHasCrossedHalfOfTheCanvas(cursorXPosition) {
      const fullWidth = this.xScale.getRangeTo();
      return cursorXPosition > fullWidth / 2;
    }

    shouldRenderButtons = b => {
      if (this.state.shouldRenderButtons !== b) {
        this.setState({ shouldRenderButtons: b });
      }
    };
  }
);

function TooltipLineAndContent({
  cursorXPositionOnCanvas,
  cursorHasCrossedHalfOfTheCanvas,
  nearestTimeInMetrics,
  ...props
}) {
  return (
    <div
      className={locals.line}
      style={{
        left: cursorXPositionOnCanvas
      }}
    >
      <div
        className={evaluateClassNames({
          [locals.rightAlignedContent]: !cursorHasCrossedHalfOfTheCanvas,
          [locals.leftAlignedContent]: cursorHasCrossedHalfOfTheCanvas
        })}
      >
        <TooltipContent
          timestamp={nearestTimeInMetrics}
          chart={props.chart}
          reverseTooltipOrder={props.reverseTooltipOrder}
        />
      </div>
    </div>
  );
}
