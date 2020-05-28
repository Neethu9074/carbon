import { on } from 'reactive-observables';
import React from 'react';

import HighlightedTimeframeCloseButton from 'in-components/Chart/components/HighlightedTimeframeCloseButton';
import { getAnimationFramesWithAnAnimationDurationOf } from 'in-services/chartRenderingAnimationFrames';
import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment } from 'in-stores/timeline';
import { getNearestDataPointDomainForTimestamp } from 'in-components/Chart/data/dataSearchUtils';
import TooltipLineAndContent from 'in-components/Chart/components/TooltipLineAndContent';
import ContextMenu from 'in-components/Chart/components/ContextMenu';
import createScale from 'in-services/scale';
import connectTo from 'in-hoc/connectTo';

import locals from './ChartOverlay.mless';

const userInteractionThrottlingMillis = 50;

export default connectTo(
  ({ chart, timeConfig }) => {
    const observables = {
      highlightedMoment: highlightedMoment$,
      events: chart.chartEventsManager.events$,
      localHighlightedTimeframe: chart.config.localHighlightedTimeframe$
    };

    if (timeConfig.autoRefresh) {
      observables.y = getAnimationFramesWithAnAnimationDurationOf(chart.config.animationDuration);
    }

    return observables;
  },
  class extends React.Component {
    static displayName = 'ChartOverlay';

    xScale = createScale();
    mouseDownPos = null;
    mouseDownDomainTime = null;
    granularityHalf = null;
    offset = 5;
    minPxToMoveUntilDragStarts = 3;

    state = {
      isDragging: false,
      showContextMenu: false,
      immediatelyOpenContextMenu: false
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
        <div className={locals.overlay}>
          <div className={locals.glassPane} ref={glassPane => (this.glassPane = glassPane)} />

          <HighlightedTimeframeCloseButton chartWrapper={this.props.chartWrapper} xScale={xScale} />

          {this.renderTooltipAndContextMenu()}
        </div>
      );
    }

    renderTooltipAndContextMenu = () => {
      const { isDragging, showContextMenu, immediatelyOpenContextMenu } = this.state;
      if (isDragging) {
        return null;
      }

      const xScale = this.xScale;
      const { highlightedMoment } = this.props;
      const localHighlightedTimeframe = !this.mouseDownPos && this.props.localHighlightedTimeframe;

      const nearestTimeInMetrics = this.getNearestTimeInMetrics();
      const cursorXPosition = this.getAnimationOffsetAwareXPosition(nearestTimeInMetrics);

      const showTooltip = cursorXPosition && !showContextMenu;

      return (
        <>
          {showTooltip && (
            <TooltipLineAndContent
              {...this.props}
              timestamp={nearestTimeInMetrics}
              cursorXPosition={cursorXPosition}
              hoveredEvent={this.getHoveredEvent(highlightedMoment)}
              align={cursorXPosition > xScale.getRangeTo() / 2 ? 'left' : 'right'}
            />
          )}
          {localHighlightedTimeframe && (
            <ContextMenu
              {...this.props}
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

    getNearestTimeInMetrics = () => {
      const xScale = this.xScale;
      const { showContextMenu } = this.state;
      const { highlightedMoment, chart } = this.props;

      if (!showContextMenu && highlightedMoment > xScale.getDomainFrom() && highlightedMoment < xScale.getDomainTo()) {
        return getNearestDataPointDomainForTimestamp(chart.config, highlightedMoment);
      }
      return null;
    };

    setupSubscriptions = () => {
      const glassPane = this.glassPane;
      this.onMouseDownSubscription = on(glassPane, 'mousedown').subscribe(this.onMouseDown.bind(this));
      this.onMouseUpSubscription = on(glassPane, 'mouseup').subscribe(this.onMouseUp.bind(this));
      this.onMouseMoveSubscription = on(glassPane, 'mousemove')
        .throttle(userInteractionThrottlingMillis)
        .subscribe(this.onMouseMove.bind(this));
      this.onMouseLeaveSubscription = on(glassPane, 'mouseleave')
        // Needs to be greater than the timeout we have defined in the mousemove handler.
        // Just to be safe we use two times the userInteractionThrottlingMillis. Theoretically
        // userInteractionThrottlingMillis should be sufficient though.
        // We must deactivate leading emit as a leading emit will circumvent the
        // userInteractionThrottlingMillis.
        .throttle(userInteractionThrottlingMillis * 2, { leading: false })
        .subscribe(this.onMouseLeave.bind(this));
      this.onContextMenuSubscription = on(glassPane, 'contextmenu').subscribe(e => e.preventDefault());
    };

    onMouseDown(e) {
      e.preventDefault();

      // clicking on the glass panel when a highlighted selection was made, only discards the selection
      // a new selection should only possible if there is no current selection
      if (!this.props.localHighlightedTimeframe) {
        this.mouseDownPos = e.offsetX || e.layerX;
        clearHighlightedMoment();
      }

      this.setState({ isDragging: true, immediatelyOpenContextMenu: false, showContextMenu: false });
      this.props.chart.config.clearLocalHighlightedTimeframe();
    }

    onMouseMove(e) {
      const { isDragging } = this.state;
      const { chart, localHighlightedTimeframe } = this.props;
      const xScale = this.xScale;
      const currentMousePos = e.offsetX || e.layerX;
      const isSnappingEnabled = !chart.config.snapHighlightingToMetricsDisabled;

      this.granularityHalf = chart.config.granularity / 2;

      if (this.mouseDownPos != null) {
        const diff = currentMousePos - this.mouseDownPos;

        // calculate the starting point of the drag & drop
        if (!this.mouseDownDomainTime && Math.abs(diff) > this.minPxToMoveUntilDragStarts) {
          this.mouseDownDomainTime = xScale.getDomain(this.mouseDownPos);
          if (isSnappingEnabled) {
            this.mouseDownDomainTime = this.snapStart(this.mouseDownDomainTime, diff > 0);
          }
        }
      }

      // tooltip highlighted moment
      if (
        !isDragging &&
        !localHighlightedTimeframe &&
        currentMousePos >= xScale.getRangeFrom() &&
        currentMousePos <= xScale.getRangeTo()
      ) {
        setHighlightedMoment(xScale.getDomain(currentMousePos));
      }

      // if dragging has not started
      if (!this.mouseDownDomainTime) {
        return;
      }

      const currentMousePosInDomainTime = xScale.getDomain(currentMousePos);
      const from = this.mouseDownDomainTime;
      const to = isSnappingEnabled ? this.snapWhileDrag(currentMousePosInDomainTime) : currentMousePosInDomainTime;

      chart.config.setLocalHighlightedtimeframe(from, to);
    }

    onMouseUp(e) {
      // the user has clicked but not dragged inside the chart
      const selectOnClick = this.mouseDownPos && !this.mouseDownDomainTime;
      if (selectOnClick) {
        const { chart } = this.props;
        const config = chart.config;

        const currentMousePos = e.offsetX || e.layerX;
        const currentMousePosInDomainTime = this.xScale.getDomain(currentMousePos);
        const nearestTimeInMetrics =
          getNearestDataPointDomainForTimestamp(config, currentMousePosInDomainTime) || currentMousePosInDomainTime;
        const granularityHalf = chart.config.granularity / 2;

        chart.config.setLocalHighlightedtimeframe(
          nearestTimeInMetrics - granularityHalf,
          nearestTimeInMetrics + granularityHalf
        );
      }

      this.mouseDownPos = null;
      this.mouseDownDomainTime = null;
      this.setState({ isDragging: false, immediatelyOpenContextMenu: selectOnClick, showContextMenu: selectOnClick });
    }

    onMouseLeave() {
      // clear tooltip highlighted moment
      clearHighlightedMoment();

      this.mouseDownPos = null;
      this.mouseDownDomainTime = null;
      this.setState({ isDragging: false });
    }

    snapStart = (time, leftToRight) => {
      const config = this.props.chart.config;

      const nearestTimeInMetrics = getNearestDataPointDomainForTimestamp(config, time);
      const timeDiff = Math.abs(nearestTimeInMetrics - time);
      const additionalSnapArea = this.getAdditionalSnapArea();

      if (timeDiff > this.granularityHalf + additionalSnapArea) {
        return time;
      }

      // is inside bar
      if (timeDiff < this.granularityHalf) {
        return nearestTimeInMetrics + (leftToRight ? -this.granularityHalf : this.granularityHalf);
      }

      const isLeftFromMetricPoint = nearestTimeInMetrics > time;
      return nearestTimeInMetrics + (isLeftFromMetricPoint ? -this.granularityHalf : this.granularityHalf);
    };

    snapWhileDrag = currentMousePosInDomainTime => {
      const config = this.props.chart.config;

      const nearestTimeInMetrics = getNearestDataPointDomainForTimestamp(config, currentMousePosInDomainTime);
      const distanceToNearestMetric = Math.abs(nearestTimeInMetrics - currentMousePosInDomainTime);
      const additionalSnapArea = this.getAdditionalSnapArea();

      if (distanceToNearestMetric > this.granularityHalf + additionalSnapArea) {
        return currentMousePosInDomainTime;
      }

      if (currentMousePosInDomainTime < nearestTimeInMetrics) {
        return nearestTimeInMetrics - this.granularityHalf;
      }
      return nearestTimeInMetrics + this.granularityHalf;
    };

    getAdditionalSnapArea = () => {
      return Math.min(
        this.granularityHalf,
        this.xScale.getDomainTo() - this.xScale.getDomain(this.xScale.getRangeTo() - this.offset)
      );
    };

    updateScale(chart) {
      const { config } = chart;

      this.xScale.setRangeFrom(0);
      this.xScale.setRangeTo(this.props.width);

      this.xScale.setDomainFrom(config.scales.xBackBuffer.getDomainFrom() + config.animationDuration);
      this.xScale.setDomainTo(config.scales.xBackBuffer.getDomainTo());

      return this.xScale;
    }

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

    disposeSubscriptions = () => {
      this.onClickSubscription = this.disposeSubscription(this.onClickSubscription);
      this.onMouseUpSubscription = this.disposeSubscription(this.onMouseUpSubscription);
      this.onMouseDownSubscription = this.disposeSubscription(this.onMouseDownSubscription);
      this.onMouseMoveSubscription = this.disposeSubscription(this.onMouseMoveSubscription);
      this.onMouseLeaveSubscription = this.disposeSubscription(this.onMouseLeaveSubscription);
      this.onContextMenuSubscription = this.disposeSubscription(this.onContextMenuSubscription);
    };

    disposeSubscription(subscription) {
      if (subscription) {
        subscription.dispose();
      }
      return null;
    }
  }
);
