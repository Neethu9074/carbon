import { get } from 'lodash';
import React from 'react';

import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import StackTrace from 'in-analyze/TraceDetail/components/CallDetails/components/StackTrace/StackTrace';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import Details from 'in-analyze/TraceDetail/components/CallDetails/components/Details/Details';
import IsSynthetic from 'in-analyze/TraceDetail/components/CallDetails/components/IsSynthetic';
import CallStatus from 'in-analyze/TraceDetail/components/CallDetails/components/CallStatus';
import Seperator from 'in-analyze/TraceDetail/components/CallDetails/components/Seperator';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Header from 'in-analyze/TraceDetail/components/CallDetails/components/Header';
import { pendingResult } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

import locals from './CallDetails.mless';

export default connect(props => ({
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
      <IsSynthetic call={call} />
      <CallStatus call={call} />
      <Details call={call} />
      <StackTrace call={call} />
    </aside>
  );
}
