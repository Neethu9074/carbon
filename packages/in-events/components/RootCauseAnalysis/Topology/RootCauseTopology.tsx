/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import ELK, { ElkExtendedEdge } from 'elkjs/lib/elk.bundled';
import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';

import { LoadingSkeleton } from '@instana/components';
import { SidePanel } from '@instana/ibm-products';

import { RootCauseTopologySVGWrapper } from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologySVGWrapper';
import convertRCALinksToElkLinks from 'in-events/components/RootCauseAnalysis/Topology/utils/convertRCALinksToElkLinks';
import convertRCANodesToElkNodes from 'in-events/components/RootCauseAnalysis/Topology/utils/convertRCANodesToElkNodes';
import { ConnectionsMap, NodesMap, RCA_TOPOLOGY_TAGS } from 'in-events/components/legacy/TopologyUtils';
import TopologyContextMenu from 'in-events/components/RootCauseAnalysis/Topology/TopologyContextMenu';
import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';
import TopologyNode from 'in-events/components/RootCauseAnalysis/Topology/TopologyNode';
import TopologyLine from 'in-events/components/RootCauseAnalysis/Topology/TopologyLine';

import locals from './RootCauseMap.mless';

interface RootCauseTopologyProps {
  relationships: ConnectionsMap[];
  nodes: NodesMap;
  width: string;
  height: string;
}

export default function RootCauseTopology({ relationships, nodes, width, height }: RootCauseTopologyProps) {
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
      />
    </div>
  );
}

const emptyNode: TopologyGraphNode = {
  id: 'unknown',
  label: 'unknown',
  entityType: 'unknown',
  metadata: {},
  tags: new Set<RCA_TOPOLOGY_TAGS>().add('RCA')
};

interface TopologyPresenterProps {
  nodes: TopologyGraphNode[];
  links: ElkExtendedEdge[];
  width: string;
  height: string;
  algorithm: string;
  setAlgorithm: React.Dispatch<React.SetStateAction<string>>;
}
function RootCauseTopologyPresenter({ nodes, links, width, height, algorithm, setAlgorithm }: TopologyPresenterProps) {
  const [positions, setPositions] = useState<TopologyGraphNode>();
  const [currentlyOpen, setCurrentlyOpen] = useState<string>('');
  const currentlyOpenEntity = nodes.find(n => n.id === currentlyOpen) || emptyNode;
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
      entityType: 'unknown',
      metadata: undefined,
      label: '',
      tags: new Set()
    }),
    [algorithm, links, nodes]
  );

  useEffect(() => {
    elk.layout(graph).then(g => setPositions(g as TopologyGraphNode));
  }, [graph, elk]);

  if (!positions) return <LoadingSkeleton />;

  const nodeElements = positions.children?.map(node => (
    <TopologyNode setCurrentlyOpen={setCurrentlyOpen} node={node as TopologyGraphNode} key={node.id} />
  ));

  const linkElements = positions.edges?.map(edge => <TopologyLine key={`link_${edge.id}`} link={edge} />);
  const defs = (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  return (
    <div>
      <RootCauseTopologySVGWrapper
        width={width}
        height={height}
        defs={defs}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
      >
        {linkElements}
        {nodeElements}
      </RootCauseTopologySVGWrapper>
      <SidePanel
        open={!isEmpty(currentlyOpen)}
        slideIn
        selectorPageContent="#rootCauseTopologyContainer"
        onRequestClose={() => setCurrentlyOpen('')}
        title={currentlyOpenEntity.label}
        className={locals.topologySidePanel}
        size="sm"
      >
        <TopologyContextMenu node={currentlyOpenEntity} />
      </SidePanel>
    </div>
  );
}
