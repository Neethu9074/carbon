/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { hierarchy, treemap } from 'd3-hierarchy';
import React from 'react';

import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import Group from 'in-components/TreeMap/components/Group';

import locals from './TreeMap.mless';

export default function TreeMap({ cwidth: customWidth, cheight: customHeight = 300, data, groupProps, nodeProps }) {
  const { ref, width: observedWidth, height: observedHeight } = useResizeObserverCustom();
  const width = customWidth || observedWidth;
  const height = customHeight || observedHeight;

  if (!width || !data) {
    return <div style={{ height: customHeight || height }} className={locals.treeMap} ref={ref} />;
  }

  const root = hierarchy(data.root)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  treemap()
    .size([width, height - 16])
    .paddingTop(node => (node.depth === 1 ? 32 : 0)) // add a top padding to groups for the header
    .paddingInner(node => (node.depth === 0 ? 8 : 4))(root);

  return (
    <div style={{ height: root.y1 - root.y0 }} className={locals.treeMap} ref={ref}>
      {root.children.map(group => (
        <Group key={group.data.id} group={group} groupProps={groupProps} nodeProps={nodeProps} />
      ))}
    </div>
  );
}
