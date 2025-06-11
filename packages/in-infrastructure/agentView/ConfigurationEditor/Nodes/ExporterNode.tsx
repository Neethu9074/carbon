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
      <div className={locals.node}>
        <ShapeNode
          className={locals.exporterNode}
          shape="rounded-square"
          renderIcon={<SvgIcon type="lib_actions_upload" size="xs" />}
          size="100%"
          title={name ?? t('in-infrastructure:collectorView.exporter')}
        />
      </div>
    </foreignObject>
  );
}
