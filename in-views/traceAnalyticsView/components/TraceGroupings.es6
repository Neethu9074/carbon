import { Map, fromJS } from 'immutable';
import React from 'react';

import { getLabel, getCategory, getTypeLabelSingular } from 'in-sdk/tracing';
import { getTraceAnalytics } from 'in-services/api/traceAnalytics';
import { selectedTraceIds$ } from 'in-stores/traces/analytics';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { dispose } from 'in-services/util/ro';

import './TraceGroupings.less';

const block = 'in-trace-analytics-groupings';

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
        this.enrichTraceGroupsWithLabelsBasedOnDataSample(result);
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
          error: error.message
        });
      }
    );
  };

  enrichTraceGroupsWithLabelsBasedOnDataSample(traceGroups) {
    for (let i = 0; i < traceGroups.length; i++) {
      this.enrichTraceGroupWithLabelsBasedOnDataSample(traceGroups[i]);
    }
  }

  enrichTraceGroupWithLabelsBasedOnDataSample(traceGroup) {
    traceGroup.fakeSpan = Map({
      name: traceGroup.spanType,
      data: fromJS(traceGroup.dataSample)
    });
    traceGroup.label = getLabel(traceGroup.fakeSpan);
    traceGroup.category = getCategory(traceGroup.fakeSpan);
    traceGroup.typeLabelSingular = getTypeLabelSingular(traceGroup.fakeSpan);
  }

  componentWillUnmount() {
    this.traceIdsSubscription = dispose(this.traceIdsSubscription);
    this.traceGroupingsSubscription = dispose(this.traceGroupingsSubscription);
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator type="dark" />;
    } else if (this.state.error) {
      return (
        <p className={`${block}__error`}>
          {this.state.error}
        </p>
      );
    }
    return <span>Got some results for ya!</span>;
  }
}
