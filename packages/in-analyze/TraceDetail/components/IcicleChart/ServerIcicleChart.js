/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import IcicleChart from 'in-analyze/TraceDetail/components/IcicleChart';
import Skeleton from 'in-new-components/Loading/Skeleton';
import connectTo from 'in-hoc/connectTo';

import locals from './ServerIcicleChart.mless';

export default connectTo(props => ({
  callTreeResult: props.mockedStream ? props.mockedStream() : getTraceActivityTree({ id: props.traceId })
}))(ServerIcicleChart);

function ServerIcicleChart(props) {
  const { callTreeResult } = props;

  const isLoading = get(callTreeResult, ['progress', 'loading'], false);
  if (isLoading) {
    return <LoadingIcicleChart progress={callTreeResult.progress} />;
  }

  const hasErrors = get(callTreeResult, ['errors', 'length']) > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={callTreeResult.errors} />;
  }

  return <IcicleChart rootCall={callTreeResult.data} {...props} />;
}

function LoadingIcicleChart({ progress }) {
  return (
    <div>
      <HorizontalIndicator progress={progress} />
      <Skeleton className={locals.skeleton} />
    </div>
  );
}
