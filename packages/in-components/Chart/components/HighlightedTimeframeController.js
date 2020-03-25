import { on } from 'reactive-observables';
import React from 'react';

import { getNearestDataPointDomainForTimestamp } from 'in-components/Chart/data/dataSearchUtils';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ chart }) => ({
    timeConfig: timeConfig$,
    localHighlightedTimeframe: chart.config.localHighlightedTimeframe$
  }),
  class extends React.Component {
    static displayName = 'HighlightedTimeframe';

    mouseDownPos = null;
    mouseDownDomainTime = null;
    granularityHalf = null;
    offset = 5;
    minPxToMoveUntilDragStarts = 3;

    state = {
      isDragging: false,
      highlightedTimeframeSetByMouseUp: false
    };

    componentDidMount() {
      this.setupSubscriptions();
    }

    componentDidUpdate(nextProps) {
      if (this.props.glassPane !== nextProps.glassPane) {
        this.disposeSubscriptions();
        this.setupSubscriptions();
      }
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    render() {
      const Content = this.props.children;
      return (
        <Content
          {...this.props}
          isDragging={this.state.isDragging}
          localHighlightedTimeframe={!this.mouseDownPos && this.props.localHighlightedTimeframe}
          highlightedTimeframeSetByMouseUp={this.state.highlightedTimeframeSetByMouseUp}
        />
      );
    }

    setupSubscriptions = () => {
      const glassPane = this.props.glassPane;
      if (!glassPane) {
        return;
      }
      this.onMouseUpSubscription = on(glassPane, 'mouseup').subscribe(this.onMouseUp.bind(this));
      this.onMouseDownSubscription = on(glassPane, 'mousedown').subscribe(this.onMouseDown.bind(this));
      this.onMouseLeaveSubscription = on(glassPane, 'mouseleave').subscribe(this.onMouseLeave.bind(this));
      this.onContextMenuSubscription = on(glassPane, 'contextmenu').subscribe(e => e.preventDefault());
      this.onMouseMoveSubscription = on(glassPane, 'mousemove')
        .throttle(50)
        .subscribe(this.onMouseMove.bind(this));
    };

    onMouseDown(e) {
      e.preventDefault();

      this.mouseDownPos = e.offsetX;
      this.setState({ isDragging: true, highlightedTimeframeSetByMouseUp: false });
      this.props.chart.config.clearLocalHighlightedTimeframe();
    }

    onMouseMove = e => {
      const { xScale, chart } = this.props;
      const currentMousePos = e.offsetX;
      const isSnappingEnabled = !chart.config.snapHighlightingToMetricsDisabled;

      this.granularityHalf = this.props.chart.config.granularity / 2;

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

      // if dragging has not started
      if (!this.mouseDownDomainTime) {
        return;
      }

      const currentMousePosInDomainTime = xScale.getDomain(currentMousePos);
      const from = this.mouseDownDomainTime;
      const to = isSnappingEnabled ? this.snapWhileDrag(currentMousePosInDomainTime) : currentMousePosInDomainTime;

      this.props.chart.config.setLocalHighlightedtimeframe(from, to);
    };

    onMouseUp(e) {
      // the user has clicked but not dragged inside the chart
      if (this.mouseDownPos && !this.mouseDownDomainTime) {
        const config = this.props.chart.config;

        const currentMousePos = e.offsetX;
        const currentMousePosInDomainTime = this.props.xScale.getDomain(currentMousePos);
        const nearestTimeInMetrics =
          getNearestDataPointDomainForTimestamp(config, currentMousePosInDomainTime) || currentMousePosInDomainTime;
        const granularityHalf = this.props.chart.config.granularity / 2;

        this.props.chart.config.setLocalHighlightedtimeframe(
          nearestTimeInMetrics - granularityHalf,
          nearestTimeInMetrics + granularityHalf
        );
      }

      this.mouseDownPos = null;
      this.mouseDownDomainTime = null;
      this.setState({ isDragging: false, highlightedTimeframeSetByMouseUp: true });
    }

    onMouseLeave() {
      this.mouseDownPos = null;
      this.mouseDownDomainTime = null;
      this.setState({ isDragging: false, highlightedTimeframeSetByMouseUp: false });
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
      const { xScale } = this.props;
      return Math.min(this.granularityHalf, xScale.getDomainTo() - xScale.getDomain(xScale.getRangeTo() - this.offset));
    };

    disposeSubscriptions = () => {
      if (this.onMouseDownSubscription) {
        this.onMouseDownSubscription.dispose();
        this.onMouseDownSubscription = null;
      }
      if (this.onMouseUpSubscription) {
        this.onMouseUpSubscription.dispose();
        this.onMouseUpSubscription = null;
      }
      if (this.onMouseMoveSubscription) {
        this.onMouseMoveSubscription.dispose();
        this.onMouseMoveSubscription = null;
      }
      if (this.onMouseLeaveSubscription) {
        this.onMouseLeaveSubscription.dispose();
        this.onMouseLeaveSubscription = null;
      }
      if (this.onClickSubscription) {
        this.onClickSubscription.dispose();
        this.onClickSubscription = null;
      }
      if (this.onContextMenuSubscription) {
        this.onContextMenuSubscription.dispose();
        this.onContextMenuSubscription = null;
      }
    };
  }
);
