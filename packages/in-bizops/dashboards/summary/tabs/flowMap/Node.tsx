/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { Button, Typography } from '@instana/components';
import { CardNode } from '@instana/carbon-charts';

import { BizOpsElkNode } from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMapPresenter';
import { t } from 'in-i18n';

import local from './Node.mless';

export interface BizOpsNodeProps extends BizOpsElkNode {
  onPaginate: () => void;
}

export default function Node({
  x,
  y,
  width,
  height,
  name,
  metrics,
  remainingTargetCount,
  onPaginate
}: BizOpsNodeProps) {
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
        <div className={classNames(local.paginationContainer, { [local.hidePagination]: remainingTargetCount === 0 })}>
          <Button
            className={local.paginationButton}
            kind="secondary"
            size="compact"
            hasIconOnly
            icon="lib_openclose_add"
            iconDescription={t('in-bizops:dashboards.flowMap.loadMore')}
            onClick={onPaginate}
          >
            {t('in-bizops:dashboards.flowMap.loadMore')}
          </Button>
        </div>
      </div>
    </foreignObject>
  );
}
