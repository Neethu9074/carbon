/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { defaultProps, compose, renameProps } from 'recompose';
import { hierarchy, treemap } from 'd3-hierarchy';
import React from 'react';

import Group from 'in-new-components/TreeMap/components/Group';
import getElementDimensions from 'in-hoc/getElementDimensions';

import locals from './TreeMap.mless';

export default compose(
  renameProps({
    cheight: 'customHeight',
    cwidth: 'customWidth'
  }),
  getElementDimensions,
  defaultProps({
    customHeight: 300
  })
)(TreeMap);

function TreeMap({ width, height, customWidth, customHeight, data, groupProps, nodeProps }) {
  if (!width || !data) {
    return <div style={{ height: customHeight || height }} className={locals.treeMap} />;
  }

  data = data.root;
  width = customWidth || width;
  height = customHeight || height;

  const root = hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  treemap()
    .size([width, height - 16])
    .paddingTop(node => (node.depth === 1 ? 32 : 0)) // add a top padding to groups for the header
    .paddingInner(node => (node.depth === 0 ? 8 : 4))(root);

  return (
    <div style={{ height: root.y1 - root.y0 }} className={locals.treeMap}>
      {root.children.map(group => (
        <Group key={group.data.id} group={group} groupProps={groupProps} nodeProps={nodeProps} />
      ))}
    </div>
  );
}
