import React from 'react';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import Chart from 'in-components/Chart/ChartReactComponent';
import Card from 'in-new-components/Card';

export default function ChartWrapperPresenter({ result, config, renderLegend = true }) {
  let { timeConfig, y1, width, customHeight } = config;
  let content;
  let withoutPadding = false;

  const height = customHeight || 160;
  if (result.errors.length > 0) {
    content = <NoDataAvailable width={width} height={height} />;
  } else if (result.progress.loading) {
    // First time progress received, percentage seems to be empty, so start with 0.2 to have a small arc
    content = <InfiniteCircle height={height} width={width} percentage={result.progress.percentage || 0.2} />;
    withoutPadding = true;
  } else {
    if (!timeConfig || !y1 || !y1.metrics) {
      content = <NoDataAvailable width={width} height={height} />;
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
