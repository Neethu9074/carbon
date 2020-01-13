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

    timeframeHighlightDraggingStart = null;

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
      this.onMouseMoveSubscription = on(glassPane, 'mousemove')
        .throttle(50)
        .subscribe(this.onMouseMove.bind(this));
      this.onMouseLeaveSubscription = on(glassPane, 'mouseleave').subscribe(this.onMouseLeave.bind(this));
    };

    onMouseDown(e) {
      e.preventDefault();

      // we only allow drag&drop on left click
      if (e.button !== 0) {
        return;
      }

      clearHighlightedTimeframe();
      this.timeframeHighlightDraggingStart = this.snapLeft(this.props.xScale.getDomain(e.offsetX));
    }

    onMouseUp() {
      this.timeframeHighlightDraggingStart = null;
    }

    onMouseMove = e => {
      const { xScale } = this.props;

      if (this.timeframeHighlightDraggingStart != null) {
        setHighlightedTimeframe(this.timeframeHighlightDraggingStart, this.snapRight(xScale.getDomain(e.offsetX)));
      }
    };

    onMouseLeave = () => {
      this.timeframeHighlightDraggingStart = null;
    };

    snapLeft = time => {
      return this.snap(time, true);
    };

    snapRight = time => {
      return this.snap(time, false);
    };

    snap = (time, floor) => {
      const config = this.props.chart.config;
      if (!config.snapHighlightingToMetrics && !config.snapHighlightingToMetricBars) {
        return time;
      }

      const nearestTimeInMetrics = getNearestDataPointDomainForTimestamp(this.props.chart.config, time, floor);
      if (config.snapHighlightingToMetricBars) {
        return floor ? nearestTimeInMetrics - config.granularity / 2 : nearestTimeInMetrics + config.granularity / 2;
      }
      return nearestTimeInMetrics;
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
