/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { CardNode } from '@instana/carbon-charts';

import locals from './nodes.mless';

interface PipelineNodeProps {
  x?: number;
  y?: number;
  height: number;
  width: number;
  name: string;
}

function PipelineIcon({ name }: { name: string }) {
  const LOGS = 'Logs';
  const TRACES = 'Traces';
  const METRICS = 'Metrics';
  if (name === LOGS) {
    return <SvgIcon type="lib_application_logging" color="black" />;
  } else if (name === TRACES) {
    return <SvgIcon type="lib_flow" color="black" />;
  } else if (name === METRICS) {
    return <SvgIcon type="lib_eum_performance" color="black" />;
  }
  return <SvgIcon type="lib_infra_beeInstanaNode" color="black" />;
}

export default function PipelineNode({ x, y, height, width, name }: PipelineNodeProps) {
  return (
    <foreignObject className={locals.nodeObject} transform={`translate(${x},${y})`} height={height} width={width}>
      <CardNode className={locals.pipelineNode} title={name} tag="div">
        <div className={locals.pipelineNodeTitle}>
          <PipelineIcon name={name} />
          <Typography variant="heading-compact-02">{name}</Typography>
        </div>
      </CardNode>
    </foreignObject>
  );
}
