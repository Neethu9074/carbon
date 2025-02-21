/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { WorkspaceImport } from '@carbon/icons-react';
import React from 'react';

import { ShapeNode } from '@instana/carbon-charts';

interface ReceiverNodeProps {
  x: number;
  y: number;
  name?: string;
}

export default function ReceiverNode({ x, y, name }: ReceiverNodeProps) {
  const height = 50;
  const width = 50;
  return (
    <foreignObject transform={`translate(${x},${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <div style={{ height, width }}>
        <ShapeNode
          shape="rounded-square"
          renderIcon={<WorkspaceImport />}
          size="100%"
          title={name ? name : 'Receiver'}
          style={{ backgroundColor: '#edf5ff' }}
        />
      </div>
    </foreignObject>
  );
}
