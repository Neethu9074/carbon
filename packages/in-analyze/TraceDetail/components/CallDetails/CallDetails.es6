import React, { Fragment } from 'react';
import { compose } from 'recompose';

import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import TabView from 'in-analyze/TraceDetail/components/CallDetails/components/TabView';
import Header from 'in-analyze/TraceDetail/components/CallDetails/components/Header';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import { pendingResult } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(props => ({
    result: getTraceActivityTreeNodeDetails({ traceId: props.traceId, nodeId: props.callId }).startWith(pendingResult)
  }))
)(CallDetails);

function CallDetails(props) {
  const { traceId, result, onClose } = props;

  const isLoading = result.progress.loading;
  if (isLoading) {
    return <LoadingCallDetails onClose={onClose} progress={result.progress} />;
  }

  const hasErrors = result.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }

  const call = result.data;

  return (
    <Fragment>
      <Header call={call} result={result} onClose={onClose} />
      <TabView call={call} traceId={traceId} />
    </Fragment>
  );
}
