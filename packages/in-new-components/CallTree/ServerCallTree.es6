import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import LoadingCallTree from 'in-new-components/CallTree/LoadingCallTree';
import getSpanTree from 'in-subscription/application/getSpanTree';
import CallTree from 'in-new-components/CallTree';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(props => ({
    rootSpanResult: props.get ? props.get({ id: props.traceId }) : getSpanTree({ id: props.traceId })
  }))
)(ServerCallTree);

function ServerCallTree(props) {
  const { rootSpanResult } = props;
  const isLoading = get(rootSpanResult, ['progress', 'loading'], false);
  if (isLoading) {
    return <LoadingCallTree progress={rootSpanResult.progress} />;
  }

  const hasErrors = rootSpanResult.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={rootSpanResult.errors} />;
  }

  return <CallTree rootSpan={rootSpanResult.data} {...props} />;
}
