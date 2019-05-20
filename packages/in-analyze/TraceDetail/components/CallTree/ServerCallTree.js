import React from 'react';

import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import CallTree from 'in-analyze/TraceDetail/components/CallTree';
import { pendingResult } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

export default connect(props => ({
  callTreeResult: getTraceActivityTree({ id: props.traceId }).startWith(pendingResult)
}))(ServerCallTree);

function ServerCallTree(props) {
  return <CallTree callTreeResult={props.callTreeResult} {...props} />;
}
