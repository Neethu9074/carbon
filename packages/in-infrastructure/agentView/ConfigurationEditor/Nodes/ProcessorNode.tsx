/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Schematics } from '@carbon/icons-react';
import React from 'react';

import { ShapeNode } from '@instana/carbon-charts';

import { t } from 'in-i18n';

interface ProcessorNodeProps {
  x: number;
  y: number;
  name?: string;
}

export default function ProcessorNode({ x, y, name }: ProcessorNodeProps) {
  const height = 50;
  const width = 50;
  return (
    <foreignObject transform={`translate(${x},${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <div style={{ height, width }}>
        <ShapeNode
          shape="rounded-square"
          renderIcon={<Schematics />}
          size="100%"
          title={name ? name : t('in-infrastructure:collectorView.processor')}
          style={{ backgroundColor: '#a6c8ff' }}
        />
      </div>
    </foreignObject>
  );
}
