/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';
import React, { useEffect, useState } from 'react';
import { Edge } from '@carbon/charts-react';
import { path as d3Path } from 'd3-path';

import Node, { BizOpsElkNode } from 'in-bizops/dashboards/summary/tabs/flowMap/Node';
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
  // positions is used to place nodes within the canvas
  const [positions, setPositions] = useState<ElkNode>();

  const width = 300;
  const height = 100;

  // add width and height to each node
  const nodesWithDimensions = fakeNodes.map(node => {
    return { ...node, width, height };
  });

  useEffect(() => {
    // placeholder awaiting backend integration
    const graph = {
      id: 'root',
      layoutOptions: { 'elk.algorithm': 'layered' },
      children: nodesWithDimensions,
      edges: fakeEdges
    };

    new ELK().layout(graph).then((g: ElkNode) => setPositions(g));
  });

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

// TODO:  Remove these after the backend data is ready, they are for early testing
const fakeEdges: ElkExtendedEdge[] = [
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
    targets: ['review_invoice'],
    labels: [{ text: 'No' }]
  },
  {
    id: '5',
    sources: ['review_invoice'],
    targets: ['review_successful']
  },
  {
    id: '6',
    sources: ['review_successful'],
    targets: ['approve_invoice'],
    labels: [{ text: 'Yes' }]
  },
  {
    id: '7',
    sources: ['review_successful'],
    targets: ['invoice_not_processed'],
    labels: [{ text: 'No' }]
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

const fakeNodes: BizOpsElkNode[] = [
  {
    id: 'approve_invoice',
    name: 'Approve Invoice',
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'review_successful',
    name: 'Review Successful',
    metrics: {
      count: [[1685118421798, 42]],
      errors: [[1685118421798, 1]],
      latency: [[1685118421798, 8]]
    }
  },
  {
    id: 'archive_invoice',
    name: 'Archive Invoice',
    metrics: {
      count: [[1685118421798, 85]],
      errors: [[1685118421798, 6]],
      latency: [[1685118421798, 154]]
    }
  },
  {
    id: 'invoice_not_processed',
    name: 'Invoice Not Processed',
    metrics: {
      count: [[1685118421798, 21]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 9]]
    }
  },
  {
    id: 'review_invoice',
    name: 'Review Invoice',
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'invoice_approved',
    name: 'Invoice Approved',
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'invoice_processed',
    name: 'Invoice Processed',
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'assign_approver_group',
    name: 'Assign Approver Group',
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'invoice_received',
    name: 'Invoice Received',
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  },
  {
    id: 'prepare_bank_transfer',
    name: 'Prepare bank transfer',
    metrics: {
      count: [[1685118421798, 103]],
      errors: [[1685118421798, 0]],
      latency: [[1685118421798, 5]]
    }
  }
];
