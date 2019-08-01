import { on, empty } from 'reactive-observables';
import React from 'react';
import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment, timeConfig$ } from 'in-stores/timeline';
import { getAnimationFramesWithAnAnimationDurationOf } from 'in-services/chartRenderingAnimationFrames';
import ApplyTimeframeButtons from 'in-components/Chart/components/ApplyTimeframeButtons';
import HighlightedTimeframe from 'in-components/Chart/components/HighlightedTimeframe';
import TooltipContent from 'in-components/Chart/components/TooltipContent';
import { evaluateClassNames } from 'in-services/util/classnames';
import getReleases from 'in-events/subscriptions/getReleases';
import { releasesEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import createScale from 'in-services/scale';
import connectTo from 'in-hoc/connectTo';

import ReleasesTooltip from './ReleasesTooltip';

import locals from './Tooltip.mless';

const userInteractionThrottlingMillis = 50;

export default connectTo(
  props => {
    let latestRelease$ = empty;
    if (releasesEnabled) {
      latestRelease$ = timeConfig$
        .flatMap(timeConfig =>
          getReleases({
            timeConfig,
            pagination: {
              page: 1,
              pageSize: 1
            }
          })
        )
        .startWith(pendingResult)
        .map(({ data }) => (data && data.items && data.items.length > 0 ? data.items[0] : null));
    }

    const observables = { highlightedMoment: highlightedMoment$, latestRelease: latestRelease$ };

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
      const nearestTimeInMetrics = this.getNearestDomain(this.props.highlightedMoment);
      const cursorXPositionOnCanvas = this.getNearestDomainXPosition(nearestTimeInMetrics);
      const cursorHasCrossedHalfOfTheCanvas = this.cursorHasCrossedHalfOfTheCanvas(cursorXPositionOnCanvas);
      this.updateScale();

      let releaseMarkerXPositionOnCanvas;
      if (releasesEnabled) {
        if (this.props.latestRelease !== null) {
          releaseMarkerXPositionOnCanvas = this.getNearestDomainXPosition(
            this.getNearestDomain(this.props.latestRelease.start)
          );
        }
      }

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
          {releasesEnabled &&
            releaseMarkerXPositionOnCanvas && (
              <ReleasesTooltip
                markerHasCrossedHalfOfTheCanvas={this.cursorHasCrossedHalfOfTheCanvas(releaseMarkerXPositionOnCanvas)}
                markerXPosition={releaseMarkerXPositionOnCanvas}
                release={this.props.latestRelease}
              />
            )}
          {cursorXPositionOnCanvas && cursorXPositionOnCanvas !== releaseMarkerXPositionOnCanvas ? (
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
      this.onMouseMoveSubscription = on(this.glassPane, 'mousemove')
        .throttle(userInteractionThrottlingMillis)
        .subscribe(this.onMouseMove.bind(this));
      this.onMouseLeaveSubscription = on(this.glassPane, 'mouseleave')
        // Needs to be greater than the timeout we have defined in the mousemove handler.
        // Just to be safe we use two times the userInteractionThrottlingMillis. Theoretically
        // userInteractionThrottlingMillis should be sufficient though.
        // We must deactivate leading emit as a leading emit will circumvent the
        // userInteractionThrottlingMillis.
        .throttle(userInteractionThrottlingMillis * 2, { leading: false })
        .subscribe(this.onMouseLeave.bind(this));
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

    getNearestDomain = time => {
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
