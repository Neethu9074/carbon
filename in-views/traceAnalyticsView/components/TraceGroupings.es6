import { Map, fromJS } from 'immutable';
import React from 'react';

import { getLabel, getCategory, getTypeLabelSingular, getTypeLabelPlural, getCategoryIcon } from 'in-sdk/tracing';
import TraceGroup from 'in-views/traceAnalyticsView/components/TraceGroup';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import { getTraceAnalytics } from 'in-services/api/traceAnalytics';
import { selectedTraceIds$ } from 'in-stores/traces/analytics';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { hexToRGB } from 'in-services/formatters/color';
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
      traceGroups: [],
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
      traceGroups: [],
      error: null
    });

    this.traceGroupingsSubscription = getTraceAnalytics({ traceIds }).once(
      traceGroups => {
        this.enrichGroups(traceGroups);
        console.log(traceGroups);
        this.setState({
          traceIds,
          isLoading: false,
          traceGroups: traceGroups,
          error: null
        });
      },
      error => {
        this.setState({
          traceIds,
          isLoading: false,
          traceGroups: [],
          error: error.message
        });
      }
    );
  };

  enrichGroups(traceGroups) {
    for (let i = 0; i < traceGroups.length; i++) {
      this.enrichGroup(traceGroups[i]);
    }
  }

  enrichGroup(traceGroup) {
    const fakeSpan = Map({
      name: traceGroup.spanType,
      data: fromJS(traceGroup.dataSample)
    });
    const category = getCategory(fakeSpan);
    const typeLabel = traceGroup.statistics.count === 1 ? getTypeLabelSingular(fakeSpan): getTypeLabelPlural(fakeSpan);

    const categoryColor = spanCategoryColors[category];
    const categoryColorRgb = hexToRGB(categoryColor);
    const categoryBackgroundOpaque = { background: categoryColor };
    const categoryBackgroundTransparent = { background: `rgba(${categoryColorRgb.r}, ${categoryColorRgb.g}, ${categoryColorRgb.b}, 0.5)` };

    traceGroup.enrichment = {
      fakeSpan,
      label: getLabel(fakeSpan),
      category,
      categoryIcon: getCategoryIcon(category),
      categoryBackgroundOpaque,
      categoryBackgroundTransparent,
      typeLabel
    };

    this.enrichGroups(traceGroup.children);
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
    return (
      <div className={block}>
        <ol className={`${block}__groupings`}>
          {this.state.traceGroups.map(traceGroup =>
            <TraceGroup key={traceGroup.hash} traceGroup={traceGroup} level={0} />
          )}
        </ol>
      </div>
    );
  }
}
