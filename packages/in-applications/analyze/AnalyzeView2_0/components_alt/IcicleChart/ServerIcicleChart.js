/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { HorizontalIndicator } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';

import IcicleChart from 'in-applications/analyze/AnalyzeView2_0/components_alt/IcicleChart/IcicleChart';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import { isLoading, hasError } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

import locals from './ServerIcicleChart.mless';

export default connectTo(props => ({
  callTreeResult: props.mockedStream ? props.mockedStream() : getTraceActivityTree({ id: props.traceId })
}))(ServerIcicleChart);

function ServerIcicleChart(props) {
  const { callTreeResult } = props;

  if (isLoading(callTreeResult)) {
    return <LoadingIcicleChart progress={callTreeResult.progress} />;
  }

  if (hasError(callTreeResult)) {
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
