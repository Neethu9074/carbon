/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Export } from '@carbon/icons-react';
import { ShapeNode } from '@instana/carbon-charts';

interface ExporterNodeProps {
  x: number;
  y: number;
  name?: string;
}

export default function ExporterNode({ x, y, name }: ExporterNodeProps) {
  const height = 50;
  const width = 50;
  return (
    <foreignObject transform={`translate(${x},${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <div style={{ height, width }}>
        <ShapeNode
          shape="rounded-square"
          renderIcon={<Export />}
          size="100%"
          title={name ? name : 'Exporter'}
          style={{ backgroundColor: '#78a9ff' }}
        />
      </div>
    </foreignObject>
  );
}
