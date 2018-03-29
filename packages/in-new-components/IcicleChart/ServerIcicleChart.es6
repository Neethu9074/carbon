import React from 'react';
import { get } from 'lodash';

import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import getSpanTree from 'in-subscription/application/getSpanTree';
import Skeleton from 'in-components/Progress/Skeleton';
import IcicleChart from 'in-new-components/IcicleChart';
import connectTo from 'in-hoc/connectTo';

import locals from './ServerIcicleChart.mless';

export default connectTo(props => ({
  rootSpanResult: props.mockedStream ? props.mockedStream() : getSpanTree({ id: props.traceId })
}))(ServerIcicleChart);

function ServerIcicleChart({ rootSpanResult, getColor }) {
  const isLoading = get(rootSpanResult, ['progress', 'loading'], false);
  if (isLoading) {
    return <LoadingIcicleChart progress={rootSpanResult.progress} />;
  }

  const hasErrors = get(rootSpanResult, ['errors', 'length']) > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={rootSpanResult.errors} />;
  }

  return <IcicleChart rootSpan={rootSpanResult.data} getColor={getColor} />;
}

function LoadingIcicleChart({ progress }) {
  return (
    <div>
      <HorizontalIndicator progress={progress} />
      <Skeleton className={locals.skeleton} />
    </div>
  );
}
