import React from 'react';

import keyCodes from 'in-components/keyCodes';
import {
  expandedNodes$,
  toggleExpandedNode,
  collapseNode,
  expandNode
} from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/stores/expandedNodes';
import {
  selectedNode$,
  setSelectedNode
} from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/stores/selectedNode';
import PercentageIndicator from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/PercentageIndicator';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './ResultTable.less';

const block = 'in-nodejs-cpu-profiling-table';

export default connectTo({
  expandedNodes: expandedNodes$,
  selectedNode: selectedNode$
}, function ResultTable({result, expandedNodes, selectedNode}) {
  return (
    <div className={`${block}__wrapper`}>
      <table className={block}
             onKeyDown={e => onKeyDown(selectedNode, e)}
             tabIndex={10000}>
        <thead>
          <tr>
            <th>Self</th>
            <th>Total</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          {createRowForNode(result, 0, expandedNodes, selectedNode, result)}
        </tbody>
      </table>
    </div>
  );
});


function createRowForNode(node, level, expandedNodes, selectedNode, rootNode) {
  const isExpanded = expandedNodes[node.id] === true;
  let indentationPx = level * 10;
  if (node.c.length === 0) {
    indentationPx += 15;
  }

  let rowClasses = `${block}__row`;
  if (selectedNode === node.id) {
    rowClasses = `${rowClasses} ${rowClasses}--selected`;
  }
  let result = [
    <tr key={node.id}
        className={rowClasses}
        onClick={() => setSelectedNode(node.id)}
        data-node-id={node.id}>
      <td className={`${block}__self`}>
        <PercentageIndicator v={node.s} p={getPercentageOfParent(node, 's', rootNode)}/>
      </td>
      <td className={`${block}__total`}>
        <PercentageIndicator v={node.t} p={getPercentageOfParent(node, 't', rootNode)}/>
      </td>
      <td className={`${block}__function`}
          style={{paddingLeft: `${indentationPx}px`}}>

        <div className={`${block}__content`}>
          {node.c.length > 0 ?
            <SvgIcon onClick={() => toggleExpandedNode(node.id)}
                     type={isExpanded ? 'triangle_down' : 'triangle_right'}
                     className={`${block}__expand`}
                     width={10}
                     height={10}/>
          : null}

          <NodeLabel node={node} />
        </div>
      </td>
    </tr>
  ];

  if (isExpanded) {
    node.c.forEach(n => {
      result = result.concat(createRowForNode(n, level + 1, expandedNodes, selectedNode, rootNode));
    });
  }

  return result;
}


function NodeLabel({node}) {
  return (
    <span className={`${block}__node-label`}>
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


function getPercentageOfParent(node, prop, rootNode) {
  if (node === rootNode) {
    return NaN;
  } else if (node[prop] > rootNode.t) {
    return NaN;
  }

  return node[prop] / (rootNode.t + 0.000000001);
}


function onKeyDown(selectedNode, e) {
  if (!selectedNode) {
    return;
  }

  const key = e.keyCode;
  if (key === keyCodes.arrows.bottom) {
    e.stopPropagation();
    e.preventDefault();
    moveSelectedNode(selectedNode, e, 1);
  } else if (key === keyCodes.arrows.top) {
    e.stopPropagation();
    e.preventDefault();
    moveSelectedNode(selectedNode, e, -1);
  } else if (key === keyCodes.arrows.left) {
    e.stopPropagation();
    e.preventDefault();
    collapseNode(selectedNode);
  } else if (key === keyCodes.arrows.right) {
    e.stopPropagation();
    e.preventDefault();
    expandNode(selectedNode);
  }
}


function moveSelectedNode(selectedNode, e, offset) {
  if (!selectedNode) {
    return;
  }

  const rows = Array.prototype.slice.call(e.target.querySelectorAll(`.${block}__row`));
  const selectedNodeIndex = rows.reduce((agg, row, i) => {
    if (row.dataset.nodeId === selectedNode) {
      return i;
    }
    return agg;
  }, -1);

  if (selectedNodeIndex === -1) {
    return;
  }

  const indexOfNewSelectedNode = selectedNodeIndex + offset;
  if (indexOfNewSelectedNode >= 0 && indexOfNewSelectedNode < rows.length) {
    setSelectedNode(rows[indexOfNewSelectedNode].dataset.nodeId);
  }
}
