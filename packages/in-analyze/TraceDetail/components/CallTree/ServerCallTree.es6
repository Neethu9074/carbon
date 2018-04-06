import { compose } from 'recompose';
import React from 'react';

import getCallTree from 'in-subscription/application/getCallTree';
import CallTree from 'in-analyze/TraceDetail/components/CallTree';
import { pendingResult } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(props => ({
    callTreeResult: getCallTree({ id: props.traceId }).startWith(pendingResult)
  }))
)(ServerCallTree);

function ServerCallTree(props) {
  return <CallTree callTreeResult={props.callTreeResult} {...props} />;
}
