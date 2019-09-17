import { get } from 'lodash';
import React from 'react';

import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import ServiceComponent from 'in-analyze/TraceDetail/components/CallDetails/components/ServiceComponent';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import IsSynthetic from 'in-analyze/TraceDetail/components/CallDetails/components/IsSynthetic';
import Seperator from 'in-analyze/TraceDetail/components/CallDetails/components/Seperator';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Header from 'in-analyze/TraceDetail/components/CallDetails/components/Header';
import { pendingResult } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import locals from './CallDetails.mless';

export default connectTo(props => ({
  callResult: getTraceActivityTreeNodeDetails({ traceId: props.traceId, nodeId: props.callId }).startWith(pendingResult)
}))(CallDetails);

function CallDetails(props) {
  const { callResult, getColor, onClose } = props;

  const isLoading = get(callResult, ['progress', 'loading']);

  if (isLoading) {
    return (
      <div className={locals.callDetails}>
        <LoadingCallDetails onClose={onClose} progress={callResult.progress} />
      </div>
    );
  }

  const hasErrors = get(callResult, ['errors', 'length'], 0) > 0;
  if (hasErrors) {
    return (
      <div className={locals.callDetails}>
        <ErroneousResultPresenter errors={callResult.errors} />
      </div>
    );
  }

  const call = callResult.data;

  return (
    <aside className={locals.callDetails}>
      <Header call={call} getColor={getColor} onClose={onClose} />
      <Seperator />
      <ServiceComponent call={call} />
      <IsSynthetic call={call} />
    </aside>
  );
}
