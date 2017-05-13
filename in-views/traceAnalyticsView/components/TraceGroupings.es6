import React from 'react';

import { getTraceAnalytics } from 'in-services/api/traceAnalytics';
import { selectedTraceIds$ } from 'in-stores/traces/analytics';
import { dispose } from 'in-services/util/ro';

export default class TraceGroupings extends React.Component {
  constructor() {
    super();

    this.traceIdsSubscription = null;
    this.traceGroupingsSubscription = null;
    this.state = {
      traceIds: [],
      loading: true,
      analyticsResult: [],
      error: null
    };
  }

  componentDidMount() {
    this.traceIdsSubscription = selectedTraceIds$.subscribe(this.onNewTraceIds);
  }

  onNewTraceIds = traceIds => {
    this.traceGroupingsSubscription = dispose(this.traceGroupingsSubscription);

    this.setState({
      traceIds,
      isLoading: true,
      analyticsResult: [],
      error: null
    });

    this.traceGroupingsSubscription = getTraceAnalytics({ traceIds }).once(
      result => {
        this.setState({
          traceIds,
          isLoading: false,
          analyticsResult: result,
          error: null
        });
      },
      error => {
        this.setState({
          traceIds,
          isLoading: false,
          analyticsResult: [],
          error
        });
      }
    );
  };

  componentWillUnmount() {
    this.traceIdsSubscription = dispose(this.traceIdsSubscription);
    this.traceGroupingsSubscription = dispose(this.traceGroupingsSubscription);
  }

  render() {
    return null;
  }
}
