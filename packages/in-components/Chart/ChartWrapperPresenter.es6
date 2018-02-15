import React from 'react';

import Chart from 'in-components/Chart/ChartReactComponent';

export default function ChartWrapperPresenter({ result, config }) {
  if (result.errors.length > 0) {
    return result.errors.join(',');
  }

  if (result.progress.loading) {
    return 'Loading...';
  }
  return <Chart {...config} />;
}
