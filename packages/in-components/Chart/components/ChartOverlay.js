import { on } from 'reactive-observables';
import React from 'react';

import HighlightedTimeframeCloseButton from 'in-components/Chart/components/HighlightedTimeframeCloseButton';
import HighlightedTimeframeController from 'in-components/Chart/components/HighlightedTimeframeController';
import { getAnimationFramesWithAnAnimationDurationOf } from 'in-services/chartRenderingAnimationFrames';
import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment } from 'in-stores/timeline';
import { getNearestDataPointDomainForTimestamp } from 'in-components/Chart/data/dataSearchUtils';
import TooltipLineAndContent from 'in-components/Chart/components/TooltipLineAndContent';
import ContextMenu from 'in-components/Chart/components/ContextMenu';
import { evaluateClassNames } from 'in-services/util/classnames';
import createScale from 'in-services/scale';
import connectTo from 'in-hoc/connectTo';

import locals from './ChartOverlay.mless';

const userInteractionThrottlingMillis = 50;

export default connectTo(
  ({ chart, timeConfig }) => {
    const observables = {
      highlightedMoment: highlightedMoment$,
      events: chart.chartEventsManager.events$
    };

    if (timeConfig.autoRefresh) {
      observables.y = getAnimationFramesWithAnAnimationDurationOf(chart.config.animationDuration);
    }

    return observables;
  },
  class extends React.Component {
    static displayName = 'ChartOverlay';

    xScale = createScale();

    state = {
      showContextMenu: false
    };

    componentDidMount() {
      this.setupSubscriptions();
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    render() {
      const { chart } = this.props;
      const xScale = this.updateScale(chart);

      return (
        <div
          className={evaluateClassNames({
            [locals.overlay]: true,
            [locals.hasY2Axis]: !!chart.config.y2
          })}
        >
          <div className={locals.glassPane} ref={glassPane => (this.glassPane = glassPane)} />

          <HighlightedTimeframeController
            {...this.props}
            xScale={xScale}
            glassPane={this.glassPane}
            setShowContextMenu={showContextMenu => this.setState({ showContextMenu })}
          >
            {this.renderTooltipAndContextMenu}
          </HighlightedTimeframeController>

          <HighlightedTimeframeCloseButton chartWrapper={this.props.chartWrapper} xScale={xScale} />
        </div>
      );
    }

    updateScale(chart) {
      const { config } = chart;

      this.xScale.setRangeFrom(0);
      this.xScale.setRangeTo(this.props.width);

      this.xScale.setDomainFrom(config.scales.xBackBuffer.getDomainFrom() + config.animationDuration);
      this.xScale.setDomainTo(config.scales.xBackBuffer.getDomainTo());

      return this.xScale;
    }

    setupSubscriptions = () => {
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

    onMouseMove = e => {
      if (e.offsetX >= this.xScale.getRangeFrom() && e.offsetX <= this.xScale.getRangeTo()) {
        setHighlightedMoment(this.xScale.getDomain(e.offsetX));
      }
    };

    onMouseLeave = () => clearHighlightedMoment();

    getAnimationOffsetAwareXPosition = nearestTimeInMetrics => {
      if (!nearestTimeInMetrics) {
        return null;
      }

      let offset = 0;
      if (this.props.y) {
        offset = Math.max(
          0,
          this.props.chart.config.animationDuration - (this.props.timeSinceLastAnimationDurationPassed || 0)
        );
      }
      return this.xScale.getRange(nearestTimeInMetrics + offset);
    };

    getHoveredEvent = highlightedMoment => {
      const levelToHoverEvent = 20;
      const highlightedMomentXPos = this.xScale.getRange(highlightedMoment);
      for (let i = 0; i < this.props.events.length; i++) {
        const event = this.props.events[i];
        const xPos = this.xScale.getRange(event.start);
        if (Math.abs(xPos - highlightedMomentXPos) < levelToHoverEvent) {
          return event;
        }
      }
    };

    renderTooltipAndContextMenu = props => {
      const {
        isDragging,
        xScale,
        highlightedMoment,
        chart,
        immediatelyOpenContextMenu,
        localHighlightedTimeframe
      } = props;
      if (isDragging) {
        return null;
      }

      const { showContextMenu } = this.state;

      let tooltipContent = null;
      if (!showContextMenu && highlightedMoment > xScale.getDomainFrom() && highlightedMoment < xScale.getDomainTo()) {
        const nearestTimeInMetrics = getNearestDataPointDomainForTimestamp(chart.config, highlightedMoment);
        if (nearestTimeInMetrics) {
          const cursorXPosition = this.getAnimationOffsetAwareXPosition(nearestTimeInMetrics);

          tooltipContent = (
            <TooltipLineAndContent
              {...props}
              timestamp={nearestTimeInMetrics}
              cursorXPosition={cursorXPosition}
              hoveredEvent={this.getHoveredEvent(highlightedMoment)}
              align={cursorXPosition > xScale.getRangeTo() / 2 ? 'left' : 'right'}
            />
          );
        }
      }

      return (
        <>
          {tooltipContent}
          {localHighlightedTimeframe && (
            <ContextMenu
              {...props}
              xScale={xScale}
              highlightedTimeframe={localHighlightedTimeframe}
              immediatelyOpenContextMenu={immediatelyOpenContextMenu}
              showContextMenu={showContextMenu}
              setShowContextMenu={showContextMenu => this.setState({ showContextMenu })}
            />
          )}
        </>
      );
    };

    disposeSubscriptions = () => {
      this.onMouseMoveSubscription.dispose();
      this.onMouseMoveSubscription = null;
      this.onMouseLeaveSubscription.dispose();
      this.onMouseLeaveSubscription = null;
    };
  }
);
