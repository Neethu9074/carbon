/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { on } from '@instana/observables';
import React from 'react';

import { clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './HighlightedTimeframeCloseButton.mless';

export default connectTo(
  { highlightedTimeframe: highlightedTimeframe$ },

  class extends React.Component {
    static displayName = 'HighlightedTimeframeCloseButton';

    state = { isVisible: false };

    componentDidMount() {
      this.setupSubscriptions();
    }

    componentDidUpdate() {
      this.disposeSubscriptions();
      this.setupSubscriptions();
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    render() {
      if (!this.state.isVisible || !this.props.highlightedTimeframe) {
        return null;
      }

      return (
        <Button className={locals.button} kind="secondary" size="compact" onClick={clearHighlightedTimeframe}>
          Clear highlight
        </Button>
      );
    }

    setupSubscriptions = () => {
      const { highlightedTimeframe, xScale, chartWrapper } = this.props;
      if (
        !highlightedTimeframe ||
        highlightedTimeframe[1] < xScale.getDomainFrom() ||
        highlightedTimeframe[0] > xScale.getDomainTo()
      ) {
        return;
      }
      this.onMouseEnterSubscription = on(chartWrapper, 'mouseenter').subscribe(this.onMouseEnter.bind(this));
      this.onMouseLeaveSubscription = on(chartWrapper, 'mouseleave').subscribe(this.onMouseLeave.bind(this));
    };

    onMouseEnter = () => this.setState({ isVisible: true });
    onMouseLeave = () => this.setState({ isVisible: false });

    disposeSubscriptions = () => {
      if (this.onMouseEnterSubscription) {
        this.onMouseEnterSubscription.dispose();
        this.onMouseEnterSubscription = null;
      }
      if (this.onMouseLeaveSubscription) {
        this.onMouseLeaveSubscription.dispose();
        this.onMouseLeaveSubscription = null;
      }
    };
  }
);
