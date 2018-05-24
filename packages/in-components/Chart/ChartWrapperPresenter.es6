import React from 'react';

import NoContent from 'in-components/Chart/components/NoContent';
import Chart from 'in-components/Chart/ChartReactComponent';
import Card from 'in-new-components/Card';

export default function ChartWrapperPresenter({ result, config, renderLegend = true }) {
  let { timeConfig, y1, width, customHeight } = config;
  let content;
  let withoutPadding = false;

  const height = customHeight || 160;
  if (result.errors.length > 0) {
    content = <NoContent height={height} errors={result.errors} />;
  } else if (result.progress.loading) {
    content = <NoContent height={height} width={width} isLoading />;
    withoutPadding = true;
  } else {
    if (!timeConfig || !y1 || !y1.metrics) {
      content = <NoContent height={height} width={width} />;
    } else {
      content = <Chart {...config} renderLegend={renderLegend} />;
    }
  }

  if (config.cardTitle == null) {
    return content;
  }

  return (
    <Card title={config.cardTitle} withoutPadding={withoutPadding}>
      {content}
    </Card>
  );
}
