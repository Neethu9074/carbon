import React from 'react';

import CallTimeAxis from 'in-analyze/TraceDetail/components/CallTimeAxis/CallTimeAxis';

import locals from './TreeHeader.mless';

export default function TreeHeader({ rootCall }) {
  return (
    <div className={locals.treeHeader}>
      <span className={locals.counter}>{`${countCalls(rootCall, 1)} Calls`}</span>
      <div className={locals.axis}>{rootCall && <CallTimeAxis call={rootCall} />}</div>
    </div>
  );
}

function countCalls(call, count = 0) {
  if (!call || !call.children || call.children.length === 0) {
    return 0;
  }

  for (let i = 0; i < call.children.length; i++) {
    count += countCalls(call.children[i]);
  }
  return call.children.length + count;
}
