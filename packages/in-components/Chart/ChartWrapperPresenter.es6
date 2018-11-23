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
    content = <InfiniteCircle height={height} width={width} />;
    withoutPadding = true;
  } else {
    if (!timeConfig || !y1 || !y1.metrics) {
      content = <NoDataAvailable width={width} height={height} />;
    } else {
      content = <Chart {...config} renderLegend={renderLegend} />;
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
