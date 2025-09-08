/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { CardNode } from '@instana/carbon-charts';

import { t } from 'in-i18n';

import locals from './nodes.mless';

interface ReceiverNodeProps {
  x: number;
  y: number;
  name?: string;
}

export default function ReceiverNode({ x, y, name }: ReceiverNodeProps) {
  const height = 75;
  const width = 200;
  return (
    <foreignObject className={locals.nodeObject} transform={`translate(${x},${y})`} height={height} width={width}>
      <CardNode className={locals.receiverNode} title={name} tag="div">
        <div className={locals.nodeInfoContainer}>
          <SvgIcon type="lib_actions_download" color="white" />
          <div className={locals.nodeInfo}>
            <Typography variant="heading-compact-02">
              {t('in-infrastructure:collectorView.editConfig.receiver')}
            </Typography>
            <Typography variant="body-01">
              <div className={locals.nodeName}>{name}</div>
            </Typography>
          </div>
        </div>
      </CardNode>
    </foreignObject>
  );
}
