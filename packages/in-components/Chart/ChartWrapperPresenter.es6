import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import Chart from 'in-components/Chart/ChartReactComponent';

export default function ChartWrapperPresenter({ result, config }) {
  if (result.errors.length > 0) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }

  if (result.progress.loading) {
    return 'Loading...';
  }
  return <Chart {...config} />;
}
