/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { HorizontalIndicator } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';

import IcicleChart from 'in-applications/analyze/components/TraceDetails/components/IcicleChart';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
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
      <LoadingSkeleton className={locals.skeleton} />
    </div>
  );
}
