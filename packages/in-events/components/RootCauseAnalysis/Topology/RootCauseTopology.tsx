/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import ELK, { ElkExtendedEdge } from 'elkjs/lib/elk.bundled';
import React, { useEffect, useMemo, useState } from 'react';

import { RootCauseTopologySVGWrapper } from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologySVGWrapper';
import convertRCALinksToElkLinks from 'in-events/components/RootCauseAnalysis/Topology/utils/convertRCALinksToElkLinks';
import convertRCANodesToElkNodes from 'in-events/components/RootCauseAnalysis/Topology/utils/convertRCANodesToElkNodes';
import { ConnectionsMap, NodesMap } from 'in-events/components/legacy/TopologyUtils';
import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';
import TopologyNode from 'in-events/components/RootCauseAnalysis/Topology/TopologyNode';
import TopologyLine from 'in-events/components/RootCauseAnalysis/Topology/TopologyLine';
import { Nullish } from 'in-types';

import locals from './RootCauseMap.mless';

interface RootCauseTopologyProps {
  relationships: ConnectionsMap[];
  nodes: NodesMap;
  width: string;
  height: string;
  selectedRCAID: string | Nullish;
}

export default function RootCauseTopology({
  relationships,
  nodes,
  width,
  height,
  selectedRCAID
}: RootCauseTopologyProps) {
  const links = convertRCALinksToElkLinks(relationships);
  const graphNodes = convertRCANodesToElkNodes(nodes);

  const [algorithm, setAlgorithm] = useState('layered');

  return (
    <div className={locals.wrapper}>
      <RootCauseTopologyPresenter
        nodes={graphNodes}
        links={links}
        width={width}
        height={height}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        selectedRCAID={selectedRCAID}
      />
    </div>
  );
}

interface TopologyPresenterProps {
  nodes: TopologyGraphNode[];
  links: ElkExtendedEdge[];
  width: string;
  height: string;
  algorithm: string;
  setAlgorithm: React.Dispatch<React.SetStateAction<string>>;
  selectedRCAID: string | Nullish;
}
function RootCauseTopologyPresenter({
  nodes,
  links,
  width,
  height,
  algorithm,
  setAlgorithm,
  selectedRCAID
}: TopologyPresenterProps) {
  const [positions, setPositions] = useState<TopologyGraphNode>();
  const [currentlyOpen, setCurrentlyOpen] = useState<string>('');
  const elk = useMemo(() => new ELK(), []);

  const graph: TopologyGraphNode = useMemo(
    () => ({
      id: 'root',
      layoutOptions: {
        'elk.algorithm': algorithm,
        'elk.padding': '[left=50, top=50, right=50, bottom=50]',
        separateConnectedComponents: 'true',
        'spacing.nodeNode': '100',
        'spacing.nodeNodeBetweenLayers': '200',
        'elk.partitioning.activate': 'true',
        'elk.layered.separateConnectedComponents': 'true'
      },
      children: nodes,
      edges: links,
      entityType: '',
      metadata: undefined,
      label: '',
      tags: new Set()
    }),
    [algorithm, links, nodes]
  );

  useEffect(() => {
    elk.layout(graph).then(g => setPositions(g as TopologyGraphNode));
  }, [graph, elk]);

  if (!positions) return null;

  const nodeElements = positions.children?.map(node => (
    <TopologyNode
      currentlyOpen={currentlyOpen}
      setCurrentlyOpen={setCurrentlyOpen}
      // @ts-expect-error type mismatch
      node={node}
      key={node.id}
    />
  ));

  const linkElements = positions.edges?.map(edge => <TopologyLine key={`link_${edge.id}`} link={edge} />);
  const defs = (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  const getCenterAround = () => {
    if (selectedRCAID) {
      const foundNode = positions.children?.find(node => node.id === selectedRCAID);
      if (foundNode && foundNode.x && foundNode.y) {
        const { x, y } = foundNode;
        return {
          x,
          y
        };
      }
    }
    return null;
  };

  return (
    <RootCauseTopologySVGWrapper
      width={width}
      height={height}
      defs={defs}
      algorithm={algorithm}
      setAlgorithm={setAlgorithm}
      centerAround={getCenterAround()}
    >
      {linkElements}
      {nodeElements}
    </RootCauseTopologySVGWrapper>
  );
}
