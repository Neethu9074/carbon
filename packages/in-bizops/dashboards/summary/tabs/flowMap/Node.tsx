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

export default function Node({ x, y, height, width }: ElkNode) {
  const count = 5762;
  const errors = 2;
  const latency = '50th';

  return (
    <foreignObject transform={`translate(${x},${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <div style={{ height, width }}>
        <CardNode className={local.container}>
          <div>
            <Typography variant="heading-compact-02">Activity Name</Typography>
          </div>
          <div className={local.metricsContainer}>
            <div className={local.metricContainer}>
              <Typography variant="label-01">Count</Typography>
              <Typography variant="body-01">{count}</Typography>
            </div>
            <div className={local.metricContainer}>
              <Typography variant="label-01">Errors</Typography>
              <Typography variant="body-01">{errors}</Typography>
            </div>
            <div className={local.metricContainer}>
              <Typography variant="label-01">Latency</Typography>
              <Typography variant="body-01">{latency}</Typography>
            </div>
          </div>
        </CardNode>
      </div>
    </foreignObject>
  );
}
