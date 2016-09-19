import React from 'react';

import {
  expandedNodes$,
  toggleExpandedNode
} from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/stores/expandedNodes';
import {msTwoDecimalPlaces} from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './ResultTable.less';

const block = 'in-nodejs-cpu-profiling-table';

const formatter = d => msTwoDecimalPlaces(d / 1000);

export default connectTo({
  expandedNodes: expandedNodes$
}, function ResultTable({result, expandedNodes}) {
  return (
    <table className={block}>
      <thead>
        <tr>
          <th>Self</th>
          <th>Total</th>
          <th>Function</th>
        </tr>
      </thead>
      <tbody>
        {createRowForNode(result, 0, expandedNodes)}
      </tbody>
    </table>
  );
});


function createRowForNode(node, level, expandedNodes) {
  const isExpanded = expandedNodes[node.id] === true;
  let indentationPx = level * 20;
  if (node.c.length === 0) {
    indentationPx += 15;
  }

  let result = [
    <tr key={node.id}
        className={`${block}__row`}>
      <td className={`${block}__self`}>
        {formatter(node.s)}
      </td>
      <td className={`${block}__total`}>
        {formatter(node.t)}
      </td>
      <td className={`${block}__function`}
          style={{paddingLeft: `${indentationPx}px`}}>

        {node.c.length > 0 ?
          <SvgIcon onClick={() => toggleExpandedNode(node.id)}
                   type={isExpanded ? 'triangle_down' : 'triangle_right'}
                   className={`${block}__expand`}
                   width={10}
                   height={10}/>
        : null}

        <NodeLabel node={node} />
      </td>
    </tr>
  ];

  if (isExpanded) {
    node.c.sort((a, b) => a.t - b.t);
    node.c.reverse();

    node.c.forEach(n => {
      result = result.concat(createRowForNode(n, level + 1, expandedNodes));
    });
  }

  return result;
}


function NodeLabel({node}) {
  return (
    <span>
      {node.f || '<anonymous>'}

      {node.u ?
        <span className={`${block}__file`}>
          {node.u}
          {node.l != null ? `:${node.l}` : null}
        </span>
      : null}
    </span>
  );
}
