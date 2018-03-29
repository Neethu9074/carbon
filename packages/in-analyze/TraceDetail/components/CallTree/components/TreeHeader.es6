import React from 'react';

import getElementDimensions from 'in-hoc/getElementDimensions';

import locals from './TreeHeader.mless';

export default function TreeHeader({ rootSpan }) {
  return (
    <div className={locals.treeHeader}>
      <span className={locals.counter}>{`${countSpans(rootSpan, 1)} Calls`}</span>
      <Axis />
    </div>
  );
}

const Axis = getElementDimensions(function Axis({ width }) {
  return <div className={locals.axis}>{width}</div>;
});

function countSpans(span, count = 0) {
  if (!span.children || span.children.length === 0) {
    return 0;
  }

  for (let i = 0; i < span.children.length; i++) {
    count += countSpans(span.children[i]);
  }
  return span.children.length + count;
}
