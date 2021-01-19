/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { track, TOPLIST_METRIC_CHANGED } from 'in-services/tracking/tracking';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import ButtonGroup from 'in-new-components/ButtonGroup';
import List from 'in-new-components/TopListCard/List';
import Card from 'in-new-components/Card';

export default function TopListCard(props) {
  const {
    result,
    title,
    metrics,
    labels,
    onChangeMetric,
    selectedMetric,
    header,
    List: ListRenderer = List,
    showMetricSelectorsForSingleMetrics,
    useMaxAvailableHeight
  } = props;

  const shouldRenderOnItem = showMetricSelectorsForSingleMetrics && metrics.length === 1;

  const headerComponent =
    header ||
    ((metrics.length > 1 || shouldRenderOnItem) && (
      <ButtonGroup
        buttonPropsList={metrics.map((metric, i) => ({
          text: labels[i],
          key: metrics[i],
          kind: shouldRenderOnItem ? 'primaryv2' : null,
          disabled: shouldRenderOnItem,
          onClick: () => {
            track(TOPLIST_METRIC_CHANGED, { title, metric: labels[i] });
            onChangeMetric(metric);
          }
        }))}
        activeKey={selectedMetric}
      />
    ));

  let content;
  let withoutPadding = false;
  const height = 160;

  if (result.progress.loading) {
    content = <LoadingIndicator text="Loading Data" height={height} />;
    withoutPadding = true;
  } else if (result.errors.length > 0) {
    content = <NoDataAvailable height={height} />;
    withoutPadding = true;
  } else if ((result.data instanceof Array && result.data.length === 0) || result.data.totalHits === 0) {
    content = <NoDataAvailable height={height} />;
    withoutPadding = true;
  } else {
    content = <ListRenderer {...props} />;
  }

  return (
    <Card
      title={title}
      header={headerComponent}
      withoutPadding={withoutPadding}
      useMaxAvailableHeight={useMaxAvailableHeight}
    >
      {content}
    </Card>
  );
}
