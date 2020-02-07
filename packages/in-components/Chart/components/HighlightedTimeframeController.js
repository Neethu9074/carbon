import { on } from 'reactive-observables';
import React from 'react';

import { setHighlightedTimeframe, clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import { getNearestDataPointDomainForTimestamp } from 'in-components/Chart/data/dataSearchUtils';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  class extends React.Component {
    static displayName = 'HighlightedTimeframe';

    mouseDownPos = null;
    mouseDownDomainTime = null;
    granularityHalf = null;
    offset = 5;
    minPxToMoveUntilDragStarts = 3;

    componentDidMount() {
      this.setupSubscriptions();
    }

    shouldComponentUpdate(nextProps) {
      return this.props.timeConfig.autoRefresh || this.props.glassPane !== nextProps.glassPane;
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
      // rendering logic is handlered inside RenderScheduler while this component serves as event handler for mouse moves
      return null;
    }

    setupSubscriptions = () => {
      const glassPane = this.props.glassPane;
      if (!glassPane) {
        return;
      }
      this.onMouseDownSubscription = on(glassPane, 'mousedown').subscribe(this.onMouseDown.bind(this));

      this.onMouseUpSubscription = on(glassPane, 'mouseup').subscribe(this.onMouseUp.bind(this));
      this.onMouseLeaveSubscription = on(glassPane, 'mouseleave').subscribe(this.onMouseUp.bind(this));

      this.onMouseMoveSubscription = on(glassPane, 'mousemove')
        .throttle(50)
        .subscribe(this.onMouseMove.bind(this));
    };

    onMouseDown(e) {
      e.preventDefault();

      // we only allow drag&drop on left click
      if (e.button !== 0) {
        return;
      }

      clearHighlightedTimeframe();
      this.mouseDownPos = e.offsetX;
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
      if (isSnappingEnabled) {
        return setHighlightedTimeframe(this.mouseDownDomainTime, this.snapWhileDrag(currentMousePosInDomainTime));
      }
      setHighlightedTimeframe(this.mouseDownDomainTime, currentMousePosInDomainTime);
    };

    onMouseUp() {
      this.mouseDownPos = null;
      this.mouseDownDomainTime = null;
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
    };
  }
);
