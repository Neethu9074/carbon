import React from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import connect from 'in-hoc/connectTo';
import getCallTree from 'in-subscription/application/getCallTree';
import { pendingResult } from 'in-services/fixedObjects';
import TimingChart from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/TimingChart';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';

export default compose(
  connect(props => ({
    callTreeResult: getCallTree({ id: props.traceId }).startWith(pendingResult)
  }))
)(ServerTimingChart);

function ServerTimingChart({ call, callTreeResult }) {
  const hasErrors = get(callTreeResult, ['errors', 'length'], 0) > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={callTreeResult.errors} />;
  }

  const isLoading = get(callTreeResult, ['progress', 'loading'], true);
  if (isLoading) {
    return <HorizontalIndicator progress={callTreeResult.progress} />;
  }

  const callTree = callTreeResult.data;
  const callTreeNode = findCallTreeNode(callTree, call.id);
  if (!callTreeNode) {
    return null;
  }

  return <TimingChart call={call} callTreeNode={callTreeNode} />;
}

function findCallTreeNode(treeNode, nodeId) {
  if (treeNode.id === nodeId) {
    return treeNode;
  }

  for (let i = 0; i < treeNode.children.length; i++) {
    const subTreeMatch = findCallTreeNode(treeNode.children[i], nodeId);
    if (subTreeMatch) {
      return subTreeMatch;
    }
  }

  return null;
}
