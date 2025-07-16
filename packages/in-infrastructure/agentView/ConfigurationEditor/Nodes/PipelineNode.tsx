/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ShapeNode } from '@instana/carbon-charts';

import locals from './nodes.mless';

interface PipelineNodeProps {
  x?: number;
  y?: number;
  height: number;
  width: number;
  name: string;
}

export default function PipelineNode({ x, y, height, width, name }: PipelineNodeProps) {
  return (
    <foreignObject className={locals.nodeObject} transform={`translate(${x},${y})`} height={height} width={width}>
      <div className={locals.node}>
        <ShapeNode
          className={locals.pipelineNode}
          shape="rounded-square"
          renderIcon={null}
          size="100%"
          title={name.charAt(0).toUpperCase() + name.slice(1)}
        />
      </div>
    </foreignObject>
  );
}
