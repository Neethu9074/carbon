import React from 'react';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import { createTracker } from 'in-services/tracking/mixpanel';
import ButtonGroup from 'in-new-components/ButtonGroup';
import List from 'in-new-components/TopListCard/List';
import Card from 'in-new-components/Card';

const trackTopListMetricChanged = createTracker('toplist.metricChanged');

export default function TopListCard(props) {
  const {
    result,
    title,
    metrics,
    labels,
    onChangeMetric,
    selectedMetric,
    List: ListRenderer = List,
    showMetricSelectorsForSingleMetrics
  } = props;

  const shouldRenderOnItem = showMetricSelectorsForSingleMetrics && metrics.length === 1;

  const header = (metrics.length > 1 || shouldRenderOnItem) && (
    <ButtonGroup
      buttonPropsList={metrics.map((metric, i) => ({
        text: labels[i],
        key: metrics[i],
        kind: shouldRenderOnItem ? 'primaryv2' : null,
        disabled: shouldRenderOnItem,
        onClick: () => {
          trackTopListMetricChanged({ title, metric: labels[i] });
          onChangeMetric(metric);
        }
      }))}
      activeKey={selectedMetric}
    />
  );

  let content;
  let withoutPadding = false;
  const height = 160;

  if (result.progress.loading) {
    content = <InfiniteCircle height={height} />;
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
    <Card title={title} header={header} withoutPadding={withoutPadding}>
      {content}
    </Card>
  );
}
