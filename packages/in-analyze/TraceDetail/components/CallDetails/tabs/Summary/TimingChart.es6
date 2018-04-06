import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import getCallTree from 'in-subscription/application/getCallTree';
import { pendingResult } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

import locals from './TimingChart.mless';

export default compose(
  connect(props => ({
    callTreeResult: getCallTree({ id: props.traceId }).startWith(pendingResult)
  }))
)(TimingChart);

function TimingChart({ call, callTreeResult }) {
  const isLoading = get(callTreeResult, ['progress', 'loading'], false);
  const hasErrors = callTreeResult.errors.length > 0;
  if (isLoading || hasErrors) {
    return null;
  }

  const callTree = callTreeResult.data;
  const callTreeNode = findCallTreeNode(callTree, call.id);
  if (!callTreeNode) {
    return null;
  }

  const networkTime = call.duration / 10; //call.networkTime || 0;
  const totalDuration = call.duration;

  return (
    <div className={locals.timingChart}>
      <DurationBlock label="Network" color="#C6EAFF" duration={networkTime * 0.2} totalDuration={totalDuration} />
      <DurationBlock label="Network" color="#C6EAFF" duration={networkTime * 0.8} totalDuration={totalDuration} />
    </div>
  );
}

function DurationBlock({ label, color, duration, totalDuration }) {
  // also on 0
  if (!duration) {
    return null;
  }

  return (
    <div
      style={{
        width: `${duration / totalDuration * 100}%`
      }}
      className={locals.durationBlockWrapper}
    >
      <div style={{ background: color }} className={locals.durationBlock}>
        <span className={locals.durationBlockLabel}>{label}</span>
      </div>
    </div>
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
