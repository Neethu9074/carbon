/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';
import React, { useState, useEffect } from 'react';
import { path as d3Path } from 'd3-path';
import classNames from 'classnames';

import { ShapeNode, Edge } from '@instana/carbon-charts';
import { useObservable } from '@instana/hooks';

import { ZoomableSVG } from 'in-infrastructure/GraphExplorer/ZoomableSVG';
import useTimeConfig from 'in-hooks/useTimeConfig';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';

import locals from './GraphExplorer.mless';

const Link = ({ link }: { link: ElkExtendedEdge }) => {
  if (!link.sections) {
    return null;
  }
  const sections = link.sections[0];
  const path = d3Path();

  path.moveTo(sections.startPoint.x, sections.startPoint.y);

  if (sections.bendPoints) {
    sections.bendPoints.forEach(b => {
      path.lineTo(b.x, b.y);
    });
  }

  path.lineTo(sections.endPoint.x, sections.endPoint.y);
  const label = link.labels?.[0];
  const labelText = label?.text;
  const labelX = label?.x;
  const labelY = label?.y;

  const hasLabel = labelText && labelX && labelY;
  return (
    <>
      <Edge path={path.toString()} markerEnd="arrow" variant="dash-sm" />
      {hasLabel && <Text text={labelText} x={labelX} y={labelY} />}
    </>
  );
};

function Text({ text, x, y }: { text: string; x: number; y: number }) {
  return (
    <text x={x} y={y}>
      {text}
    </text>
  );
}

const Node = ({ x, y, height, width, plugin, id, snapshotId, setSnapshotId }: GraphNode) => {
  const timeConfig = useTimeConfig();
  const snapshot = useObservable(getSnapshot(id, timeConfig), [snapshotId, timeConfig]);
  return (
    <foreignObject transform={`translate(${x},${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <div style={{ height, width }}>
        <ShapeNode
          renderIcon={
            <Tooltip content={snapshot?.get('label')} align="bottomMiddle">
              <PluginIcon plugin={plugin} />
            </Tooltip>
          }
          size="100%"
          title=""
          className={classNames({
            [locals.highlight]: snapshotId === id
          })}
          onClick={() => setSnapshotId(id)}
        />
      </div>
    </foreignObject>
  );
};

export interface GraphNode extends ElkNode {
  plugin?: string;
  snapshotId: string;
  setSnapshotId: (snapshotId: string) => void;
}

export interface ElkProps {
  nodes: GraphNode[];
  links: ElkExtendedEdge[];
  layout: string;
  snapshotId: string;
  setSnapshotId: (snapshotId: string) => void;
}

const GraphExplorerPresenter = ({ nodes, links, layout, snapshotId, setSnapshotId }: ElkProps) => {
  const [positions, setPositions] = useState<ElkNode>();

  useEffect(() => {
    const graph: ElkNode = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': layout,
        'elk.padding': '[left=50, top=50, right=50, bottom=50]',
        separateConnectedComponents: 'false',
        'spacing.nodeNode': '30',
        'spacing.nodeNodeBetweenLayers': '100'
      },
      children: nodes,
      edges: links
    };
    new ELK().layout(graph).then((g: ElkNode) => setPositions(g));
  }, [layout, links, nodes]);

  if (!positions) return null;

  const nodeElements = positions.children?.map(node => (
    <Node key={node.id} {...node} snapshotId={snapshotId} setSnapshotId={setSnapshotId} />
  ));
  const linkElements = positions.edges?.map(edge => <Link key={`link_${edge.id}`} link={edge} />);
  const defs = (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  return (
    <ZoomableSVG width="100%" height="1000" defs={defs}>
      {linkElements}
      {nodeElements}
    </ZoomableSVG>
  );
};

export default GraphExplorerPresenter;
