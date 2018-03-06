import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import Chart from 'in-components/Chart/ChartReactComponent';
import Card from 'in-new-components/Card';

export default function ChartWrapperPresenter({ result, config }) {
  let content;
  let withoutPadding = false;

  if (result.errors.length > 0) {
    content = <ErroneousResultPresenter errors={result.errors} />;
  } else if (result.progress.loading) {
    content = <HorizontalIndicator progress={result.progress} />;
    withoutPadding = true;
  } else {
    content = <Chart {...config} />;
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
