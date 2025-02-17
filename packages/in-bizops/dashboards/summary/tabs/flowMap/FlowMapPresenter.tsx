/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';
import React, { useEffect, useState } from 'react';
import { Edge } from '@carbon/charts-react';
import { path as d3Path } from 'd3-path';

import { Result } from '@instana/types';

import Node, { BizOpsElkNode } from 'in-bizops/dashboards/summary/tabs/flowMap/Node';
import { BusinessFlowMap } from 'in-bizops/subscriptions/getBusinessFlowMap';
import { Canvas } from 'in-bizops/dashboards/summary/tabs/flowMap/Canvas';

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
      <Edge path={path.toString()} markerEnd="arrow" color="black" />
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

interface FlowMapPresenterProps {
  mapData: Result<BusinessFlowMap> | null | undefined;
}

export default function FlowMapPresenter({ mapData }: FlowMapPresenterProps) {
  // positions is used to place nodes within the canvas
  const [positions, setPositions] = useState<ElkNode>();

  const { children, edges } = buildElkGraphContent(mapData?.data);

  useEffect(() => {
    // placeholder awaiting backend integration
    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': '100.0', // vertical spacing
        'elk.layered.spacing.nodeNodeBetweenLayers': '50.0', // horizontal spacing
        'elk.layered.spacing.edgeNodeBetweenLayers': '50.0'
      },
      children,
      edges
    };

    new ELK().layout(graph).then((g: ElkNode) => setPositions(g));
  }, [children, edges]);

  if (!positions) return null;

  const nodeElements = positions.children?.map(node => <Node key={node.id} {...(node as BizOpsElkNode)} />);
  const linkElements = positions.edges?.map(edge => <Link key={`link_${edge.id}`} link={edge} />);

  const defs = (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  return (
    <Canvas width="100%" height="1000" defs={defs}>
      {linkElements}
      {nodeElements}
    </Canvas>
  );
}

const buildElkGraphContent = (mapData?: BusinessFlowMap) => {
  let children: ElkNode[] = [];
  let edges: ElkExtendedEdge[] = [];

  if (mapData?.graph) {
    edges = mapData.graph.edges.map(edge => {
      return {
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target]
      };
    });

    children = mapData.graph.nodes.map(node => {
      const rawName = node.id.charAt(0).toUpperCase() + node.id.slice(1);
      return {
        id: node.id,
        name: rawName.replace('_', ' '),
        metrics: {
          count: [[1685118421798, 103]],
          errors: [[1685118421798, 0]],
          latency: [[1685118421798, 5]]
        },
        width: 250,
        height: 100
      };
    });
  }

  return { children, edges };
};
