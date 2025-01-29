/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';
import React, { useEffect, useState } from 'react';
import { Edge } from '@carbon/charts-react';
import { path as d3Path } from 'd3-path';

import { ZoomableSVG } from 'in-infrastructure/GraphExplorer/ZoomableSVG';
import Node from 'in-bizops/dashboards/summary/tabs/flowMap/Node';

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

export default function FlowMapPresenter() {
  const [positions, setPositions] = useState<ElkNode>();
  const width = 300;
  const height = 100;

  useEffect(() => {
    // placeholder awaiting backend integration
    const graph = {
      id: 'root',
      layoutOptions: { 'elk.algorithm': 'layered' },
      children: [
        { id: 'n1', width: width, height: height },
        { id: 'n2', width: width, height: height },
        { id: 'n3', width: width, height: height }
      ],
      edges: [
        { id: 'e1', sources: ['n1'], targets: ['n2'] },
        { id: 'e2', sources: ['n1'], targets: ['n3'] }
      ]
    };

    new ELK().layout(graph).then((g: ElkNode) => setPositions(g));
  });

  if (!positions) return null;

  const nodeElements = positions.children?.map(node => <Node key={node.id} {...node} />);
  const linkElements = positions.edges?.map(edge => <Link key={`link_${edge.id}`} link={edge} />);

  const defs = (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  return (
    // possibly make our own ZoomableSVG if required, discussion in #tech-ui-dev
    <ZoomableSVG width="100%" height="1000" defs={defs}>
      {linkElements}
      {nodeElements}
    </ZoomableSVG>
  );
}
