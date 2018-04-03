import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import LoadingCallTree from 'in-analyze/TraceDetail/components/CallTree/LoadingCallTree';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import getSpanTree from 'in-subscription/application/getSpanTree';
import CallTree from 'in-analyze/TraceDetail/components/CallTree';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(props => ({
    spanTreeResult: props.get ? props.get({ id: props.traceId }) : getSpanTree({ id: props.traceId })
  }))
)(ServerCallTree);

function ServerCallTree(props) {
  const { spanTreeResult } = props;
  const isLoading = get(spanTreeResult, ['progress', 'loading'], false);
  if (isLoading) {
    return <LoadingCallTree progress={spanTreeResult.progress} />;
  }

  const hasErrors = spanTreeResult.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={spanTreeResult.errors} />;
  }

  return <CallTree rootCall={spanTreeResult.data} {...props} />;
}
