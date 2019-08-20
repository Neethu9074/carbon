import { on } from 'reactive-observables';
import React from 'react';

import {
  highlightedTimeframe$,
  setHighlightedTimeframe,
  clearHighlightedTimeframe
} from 'in-stores/timeline/highlightedTimeframe';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    highlightedTimeframe: highlightedTimeframe$
  },
  class extends React.Component {
    static displayName = 'HighlightedTimeframe';

    timeframeHighlightDraggingStart = null;

    componentDidMount() {
      this.setupSubsriptions();
    }

    shouldComponentUpdate(nextProps) {
      if (
        this.props.timeConfig.autoRefresh ||
        this.props.glassPane !== nextProps.glassPane ||
        this.props.highlightedTimeframe !== nextProps.highlightedTimeframe
      ) {
        return true;
      }
      return false;
    }

    componentDidUpdate(nextProps) {
      if (this.props.glassPane !== nextProps.glassPane) {
        this.disposeSubscriptions();
        this.setupSubsriptions();
      }
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    setupSubsriptions = () => {
      const glassPane = this.props.glassPane;
      if (!glassPane) {
        return;
      }
      this.onMouseDownSubscription = on(glassPane, 'mousedown').subscribe(this.onMouseDown.bind(this));
      this.onMouseUpSubscription = on(glassPane, 'mouseup').subscribe(this.onMouseUp.bind(this));
      this.onMouseMoveSubscription = on(glassPane, 'mousemove').subscribe(this.onMouseMove.bind(this));
      this.onMouseLeaveSubscription = on(glassPane, 'mouseleave').subscribe(this.onMouseLeave.bind(this));
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

    render() {
      // rendering logic is handlered inside RenderScheduler while this component serves as event handler for mouse moves
      return null;
    }

    onMouseDown(e) {
      e.preventDefault();

      clearHighlightedTimeframe();
      this.timeframeHighlightDraggingStart = this.getTimeAtPosition(e.offsetX);
    }

    onMouseUp() {
      this.timeframeHighlightDraggingStart = null;
    }

    onMouseMove = e => {
      if (this.timeframeHighlightDraggingStart != null) {
        setHighlightedTimeframe(this.timeframeHighlightDraggingStart, this.getTimeAtPosition(e.offsetX));
      }
      if (this.props.highlightedTimeframe) {
        const cursorPosition = this.getTimeAtPosition(e.offsetX);
        if (
          cursorPosition >= this.props.highlightedTimeframe[0] &&
          cursorPosition <= this.props.highlightedTimeframe[1]
        ) {
          this.props.shouldRenderButtons(true);
        } else {
          this.props.shouldRenderButtons(false);
        }
      } else {
        this.props.shouldRenderButtons(false);
      }
    };

    onMouseLeave = () => {
      this.timeframeHighlightDraggingStart = null;
    };

    getTimeAtPosition = xPos => {
      return this.props.xScale.getDomain(xPos);
    };
  }
);
