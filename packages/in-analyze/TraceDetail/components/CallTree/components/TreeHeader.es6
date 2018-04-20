import React from 'react';

import CallTimeAxis from 'in-analyze/TraceDetail/components/CallTimeAxis/CallTimeAxis';

import locals from './TreeHeader.mless';

export default function TreeHeader({ rootCall }) {
  return (
    <div className={locals.treeHeader}>
      <span className={locals.counter}>{`${countCalls(rootCall)} Calls`}</span>
      <div className={locals.axis}>{rootCall && <CallTimeAxis call={rootCall} />}</div>
    </div>
  );
}

function countCalls(call) {
  if (!call) {
    return 0;
  }

  let count = 1;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      count += countCalls(call.children[i]);
    }
  }
  return count;
}
