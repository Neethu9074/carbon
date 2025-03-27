/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';
import React, { useEffect, useState } from 'react';
import { Edge } from '@carbon/charts-react';
import { path as d3Path } from 'd3-path';

import { TimeConfig } from '@instana/types';

import { BizOpsMapData } from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMap';
import { Canvas } from 'in-bizops/dashboards/summary/tabs/flowMap/Canvas';
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
  return <Edge path={path.toString()} markerEnd="arrow" color="black" />;
};

export interface BizOpsElkNode extends ElkNode {
  name: string;
  endpointIds: string[];
  metrics: { [index: string]: number[][] };
  remainingTargetCount: number;
}

interface FlowMapPresenterProps {
  timeConfig: TimeConfig;
  mapData: BizOpsMapData | undefined;
  addPaginateData: (nodeId: string) => void;
}

export default function FlowMapPresenter({ timeConfig, mapData, addPaginateData }: FlowMapPresenterProps) {
  // positions is used to place nodes within the canvas
  const [positions, setPositions] = useState<ElkNode>();
  // Used to determine which node was clicked on by the user
  // and should display the health overlay
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');

  function handleNodeClick(nodeId: string) {
    setSelectedNodeId(nodeId);
  }

  function handlePaginateClick(nodeId: string) {
    addPaginateData(nodeId);
  }

  useEffect(() => {
    if (mapData) {
      const graph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.spacing.nodeNode': '100.0', // vertical spacing
          'elk.layered.spacing.nodeNodeBetweenLayers': '50.0', // horizontal spacing
          'elk.layered.spacing.edgeNodeBetweenLayers': '50.0'
        },
        children: mapData.nodes,
        edges: mapData.edges
      };

      new ELK().layout(graph).then((g: ElkNode) => setPositions(g));
    }
  }, [mapData]);

  if (!positions) return null;

  // If an node is selected, we need to render the overlay. Due to the painters model of rendering SVG elements,
  // we need to move the active node to the bottom of the DOM to correctly render the overlay on top of all other nodes
  const activeNodeIndex = positions.children?.findIndex(node => node?.id === selectedNodeId) ?? -1;
  if (positions?.children !== undefined && positions.children.length >= 0 && activeNodeIndex >= 0)
    positions.children?.push(positions.children.splice(activeNodeIndex, 1)[0]);

  const nodeElements = positions.children?.map(node => (
    <Node
      key={node.id}
      selectedNodeId={selectedNodeId}
      handleNodeClick={handleNodeClick}
      handlePaginateClick={handlePaginateClick}
      node={node as BizOpsElkNode}
      timeConfig={timeConfig}
      inContentArea
    />
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
    <Canvas width="100%" height="100vh" defs={defs}>
      {linkElements}
      {nodeElements}
    </Canvas>
  );
}
