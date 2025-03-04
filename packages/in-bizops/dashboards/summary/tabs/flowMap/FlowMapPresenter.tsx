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

import { BusinessFlowMap } from 'in-bizops/subscriptions/getBusinessFlowMap';
import { Canvas } from 'in-bizops/dashboards/summary/tabs/flowMap/Canvas';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import Node from 'in-bizops/dashboards/summary/tabs/flowMap/Node';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { bizopsFlowMapLoadMore } from 'in-bizops/tracker';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

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
  return (
    <>
      <Edge path={path.toString()} markerEnd="arrow" color="black" />
    </>
  );
};

export interface BizOpsElkNode extends ElkNode {
  name: string;
  metrics: { [index: string]: number[][] };
  remainingTargetCount: number;
}

interface FlowMapPresenterProps {
  mapData: Result<BusinessFlowMap> | null | undefined;
}

export default function FlowMapPresenter({ mapData }: FlowMapPresenterProps) {
  // positions is used to place nodes within the canvas
  const [positions, setPositions] = useState<ElkNode>();
  // Used to determine which node was clicked on by the user
  // and should display the health overlay
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  function handleNodeClick(nodeId: string) {
    setSelectedNodeId(nodeId);
  }

  const location: Location = useLocation();
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessId: string = getMatrixParameter(location, businessProcessDashboard, 'definitionId') ?? '';

  // TODO:  This currently fakes the pagination so we can get design feedback.  When ready for real data,
  // we just need to make a new subscription with the clicked node as the originNodeId
  const onPaginate = (nodeId: string) => {
    bizopsFlowMapLoadMore({
      processName: businessProcessName,
      processId: businessProcessId,
      activityId: nodeId,
      path: location.pathname
    });
    mapData?.data?.graph?.edges?.forEach(() => {});
    fakeNodes = fakeNodes.concat([
      {
        id: 'newPaginatedNode',
        name: 'New Loaded Node!',
        remainingTargetCount: 0,
        metrics: {
          count: [[1685118421798, 103]],
          errors: [[1685118421798, 0]],
          latency: [[1685118421798, 5]]
        }
      },
      {
        id: 'newPaginatedNode2',
        name: 'Another new node',
        remainingTargetCount: 0,
        metrics: {
          count: [[1685118421798, 103]],
          errors: [[1685118421798, 0]],
          latency: [[1685118421798, 5]]
        }
      }
    ]);

    // remove the pagination button from the clicked element
    fakeNodes[6] = {
      id: 'invoice_processed',
      name: 'Invoice Processed',
      remainingTargetCount: 0,
      metrics: {
        count: [[1685118421798, 103]],
        errors: [[1685118421798, 0]],
        latency: [[1685118421798, 5]]
      }
    };

    fakeEdges = fakeEdges.concat([
      {
        id: '11',
        sources: ['invoice_processed'],
        targets: ['newPaginatedNode']
      },
      {
        id: '12',
        sources: ['invoice_processed'],
        targets: ['newPaginatedNode2']
      }
    ]);
  };

  const { children, edges } = buildElkGraphContent();

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

  const nodeElements = positions.children?.map(node => (
    <Node
      key={node.id}
      selectedNodeId={selectedNodeId}
      handleNodeClick={handleNodeClick}
      node={node as BizOpsElkNode}
      onPaginate={() => {
        onPaginate(node.id);
      }}
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
    <Canvas width="100%" height="1000" defs={defs}>
      {linkElements}
      {nodeElements}
    </Canvas>
  );
}

const buildElkGraphContent = () => {
  let children: ElkNode[] = [];
  let edges: ElkExtendedEdge[] = [];
  const width = 250;
  const height = 100;

  // TODO: this is for getting design feedback while the backend is still on Fyre -
  // we need something consistent to render in pink.  Un-comment this section when ready for real data
  children = fakeNodes.map(node => {
    return { ...node, width, height };
  });
  edges = fakeEdges;
  /*if (mapData?.graph) {
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
        width,
        height
      };
    });
  } */

  return { children, edges };
};

let fakeEdges: ElkExtendedEdge[] = [
  {
    id: '1',
    sources: ['invoice_received'],
    targets: ['assign_approver_group']
  },
  {
    id: '2',
    sources: ['assign_approver_group'],
    targets: ['approve_invoice']
  },
  {
    id: '3',
    sources: ['approve_invoice'],
    targets: ['invoice_approved']
  },

  {
    id: '4',
    sources: ['invoice_approved'],
    targets: ['review_invoice']
  },
  {
    id: '5',
    sources: ['review_invoice'],
    targets: ['review_successful']
  },
  {
    id: '6',
    sources: ['review_successful'],
    targets: ['approve_invoice']
  },
  {
    id: '7',
    sources: ['review_successful'],
    targets: ['invoice_not_processed']
  },
  {
    id: '8',
    sources: ['invoice_approved'],
    targets: ['prepare_bank_transfer']
  },
  {
    id: '9',
    sources: ['prepare_bank_transfer'],
    targets: ['archive_invoice']
  },
  {
    id: '10',
    sources: ['archive_invoice'],
    targets: ['invoice_processed']
  }
];

let fakeNodes: BizOpsElkNode[] = [
  {
    id: 'approve_invoice',
    name: 'Approve Invoice',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'review_successful',
    name: 'Review Successful',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 42]],
      errors: [[1685118421798, 1]],
      latency: [[1685118421798, 8]]
    }
  },
  {
    id: 'archive_invoice',
    name: 'Archive Invoice',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 85]],
      errors: [[1685118421798, 6]],
      latency: [[1685118421798, 154]]
    }
  },
  {
    id: 'invoice_not_processed',
    name: 'Invoice Not Processed',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 21]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 9]]
    }
  },
  {
    id: 'review_invoice',
    name: 'Review Invoice',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'invoice_approved',
    name: 'Invoice Approved',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'invoice_processed',
    name: 'Invoice Processed',
    remainingTargetCount: 1,
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'assign_approver_group',
    name: 'Assign Approver Group',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'invoice_received',
    name: 'Invoice Received',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'prepare_bank_transfer',
    name: 'Prepare bank transfer',
    remainingTargetCount: 0,
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  }
];
