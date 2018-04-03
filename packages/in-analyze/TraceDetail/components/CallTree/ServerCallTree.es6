import { compose } from 'recompose';
import React from 'react';

import getSpanTree from 'in-subscription/application/getSpanTree';
import CallTree from 'in-analyze/TraceDetail/components/CallTree';
import { pendingResult } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(props => ({
    spanTreeResult: getSpanTree({ id: props.traceId }).startWith(pendingResult)
  }))
)(ServerCallTree);

function ServerCallTree(props) {
  return <CallTree spanTreeResult={props.spanTreeResult} {...props} />;
}
