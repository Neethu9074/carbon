/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ShapeNode } from '@instana/carbon-charts';
import { SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from './nodes.mless';

interface ProcessorNodeProps {
  x: number;
  y: number;
  name?: string;
}

export default function ProcessorNode({ x, y, name }: ProcessorNodeProps) {
  const height = 50;
  const width = 50;
  return (
    <foreignObject className={locals.nodeObject} transform={`translate(${x},${y})`} height={height} width={width}>
      <div className={locals.node}>
        <ShapeNode
          className={locals.processorNode}
          shape="rounded-square"
          renderIcon={<SvgIcon type="lib_infra_ibmCloudSchematics" size="xs" />}
          size="100%"
          title={name ?? t('in-infrastructure:collectorView.processor')}
        />
      </div>
    </foreignObject>
  );
}
