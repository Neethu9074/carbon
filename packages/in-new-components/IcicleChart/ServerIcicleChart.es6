import { compose } from 'recompose';
import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import getSpanTree from 'in-subscription/application/getSpanTree';
import Skeleton from 'in-components/Progress/Skeleton';
import IcicleChart from 'in-new-components/IcicleChart';
import connect from 'in-hoc/connectTo';

import locals from './ServerIcicleChart.mless';

export default compose(connect(props => ({ rootSpanResult: getSpanTree({ id: props.traceId }) })))(ServerIcicleChart);

function ServerIcicleChart({ rootSpanResult, getColor }) {
  const isLoading = rootSpanResult.progress.loading;
  const hasErrors = rootSpanResult.errors.length > 0;
  if (isLoading) {
    return <DefaultLoadingIcicleChart />;
  }
  if (hasErrors) {
    return <ErroneousResultPresenter errors={rootSpanResult.errors} />;
  }

  return <IcicleChart rootSpan={rootSpanResult.data} getColor={getColor} />;
}

function DefaultLoadingIcicleChart() {
  return <Skeleton className={locals.skeleton} />;
}
