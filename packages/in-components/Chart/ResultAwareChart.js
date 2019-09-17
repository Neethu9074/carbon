import React from 'react';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import Chart from 'in-components/Chart/ChartReactComponent';
import Card from 'in-new-components/Card';

export default function ResultAwareChart({ result, config, renderLegend = true }) {
  let { timeConfig, y1, frontBufferWidth, customHeight } = config;
  let content;
  let withoutPadding = false;

  const height = customHeight || 160;
  if (result.errors.length > 0) {
    content = <NoDataAvailable width={frontBufferWidth} height={height} />;
  } else if (result.progress.loading) {
    // First time progress received, percentage seems to be empty, so start with 0.2 to have a small arc
    content = (
      <InfiniteCircle
        height={height}
        frontBufferWidth={frontBufferWidth}
        percentage={result.progress.percentage || 0.2}
      />
    );
    withoutPadding = true;
  } else {
    if (!timeConfig || !y1 || !y1.metrics || containsOnlyEmptyData(y1.metrics)) {
      content = <NoDataAvailable width={frontBufferWidth} height={height} />;
    } else {
      content = <Chart renderLegend={renderLegend} {...config} />;
    }
  }

  if (config.cardTitle == null) {
    return content;
  }

  return (
    <Card title={config.cardTitle} withoutPadding={withoutPadding} header={config.cardHeader}>
      {content}
    </Card>
  );
}

function containsOnlyEmptyData(metrics) {
  const keys = Object.keys(metrics);
  for (let i = 0; i < keys.length; i++) {
    if (metrics[keys[i]] && metrics[keys[i]].length > 0) {
      return false;
    }
  }
  return true;
}
