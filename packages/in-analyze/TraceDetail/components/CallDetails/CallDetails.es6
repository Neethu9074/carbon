import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import LoadingCallDetails from 'in-analyze/TraceDetail/components/CallDetails/LoadingCallDetails';
import Header from 'in-analyze/TraceDetail/components/CallDetails/components/Header';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import tabs from 'in-analyze/TraceDetail/components/CallDetails/tabs/index';
import { pendingResult } from 'in-services/fixedObjects';
import TabView from 'in-new-components/TabView';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(props => ({
    callResult: getTraceActivityTreeNodeDetails({ traceId: props.traceId, nodeId: props.callId }).startWith(
      pendingResult
    ),
    callTreeResult: getTraceActivityTree({ id: props.traceId }).startWith(pendingResult)
  }))
)(CallDetails);

function CallDetails(props) {
  const { callResult, callTreeResult, getColor, onClose } = props;

  const isLoading = get(callResult, ['progress', 'loading']) || get(callTreeResult, ['progress', 'loading']);
  if (isLoading) {
    return <LoadingCallDetails onClose={onClose} progress={callResult.progress} />;
  }

  const hasErrors = get(callResult, ['errors', 'length']) + get(callTreeResult, ['errors', 'length']) > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={callResult.errors} />;
  }

  const call = callResult.data;
  const callTreeNode = findCallTreeNode(callTreeResult.data, call.id);

  return (
    <Fragment>
      <Header call={call} callTreeNode={callTreeNode} onClose={onClose} />
      <TabView tabs={tabs} call={call} callTreeNode={callTreeNode} getColor={getColor} />
    </Fragment>
  );
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
