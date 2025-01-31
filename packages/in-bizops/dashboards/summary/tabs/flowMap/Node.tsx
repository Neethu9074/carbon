/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ElkNode } from 'elkjs/lib/elk.bundled';
import React from 'react';

import { CardNode } from '@instana/carbon-charts';
import { Typography } from '@instana/components';

import local from './Node.mless';

export interface BizOpsElkNode extends ElkNode {
  name: string;
  metrics: { [index: string]: number[][] };
}

export default function Node({ x, y, width, height, name, metrics }: BizOpsElkNode) {
  return (
    <foreignObject transform={`translate(${x},${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <div style={{ height, width }}>
        <CardNode className={local.container}>
          <div>
            <Typography variant="heading-compact-02">{name}</Typography>
          </div>
          <div className={local.metricsContainer}>
            <div className={local.metricContainer}>
              <Typography variant="label-01">Count</Typography>
              <Typography variant="body-01">{metrics.count[0][1]}</Typography>
            </div>
            <div className={local.metricContainer}>
              <Typography variant="label-01">Errors</Typography>
              <Typography variant="body-01">{metrics.errors[0][1]}</Typography>
            </div>
            <div className={local.metricContainer}>
              <Typography variant="label-01">Latency</Typography>
              <Typography variant="body-01">{metrics.latency[0][1]}</Typography>
            </div>
          </div>
        </CardNode>
      </div>
    </foreignObject>
  );
}
