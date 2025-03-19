/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonPopover, CarbonPopoverContent, IconButton, Button, Stack, Typography } from '@instana/components';
import { CardNode } from '@instana/carbon-charts';

import { BizOpsElkNode } from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMapPresenter';
import { bizopsProcessFlowMapHealthOverlayEnabled } from 'in-services/featureFlags';
import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import local from './Node.mless';

interface ProcessNodeProps {
  name: string;
  metrics: { [index: string]: number[][] };
  onClick: (() => void) | undefined;
}

function ProcessNode({ name, metrics, onClick }: ProcessNodeProps) {
  const count = metrics?.count?.[0] ? metrics.count[0][1] : 0;
  const errors = metrics?.erroneous_call_count?.[0] ? metrics.erroneous_call_count[0][1] : 0;
  const latency = metrics?.latency?.[0] ? millis.compact(metrics.latency[0][1]) : '0ms';
  return (
    <CardNode className={local.container} onClick={onClick}>
      <div>
        <Typography variant="heading-compact-02">{name}</Typography>
      </div>
      <div className={local.metricsContainer}>
        <div className={local.metricContainer}>
          <Typography variant="label-01">{t('in-bizops:dashboards.flowMap.count')}</Typography>
          <Typography variant="body-01">{count}</Typography>
        </div>
        <div className={local.metricContainer}>
          <Typography variant="label-01">{t('in-bizops:dashboards.flowMap.errors')}</Typography>
          <Typography variant="body-01">{errors}</Typography>
        </div>
        <div className={local.metricContainer}>
          <Typography variant="label-01">{t('in-bizops:dashboards.flowMap.latency')}</Typography>
          <Typography variant="body-01">{latency}</Typography>
        </div>
      </div>
    </CardNode>
  );
}

interface HealthOverlayProps {
  selectedNodeId: string;
  nodeId: string;
  handleNodeClick: (nodeId: string) => void;
}

function HealthOverlay(props: HealthOverlayProps) {
  const { selectedNodeId, nodeId, handleNodeClick } = props;
  return (
    <CarbonPopover open={selectedNodeId === nodeId}>
      <CarbonPopoverContent>
        <Stack gap="disabled">
          <Stack gap="disabled" direction="horizontal" distribution="spaceBetween" align="center">
            <Typography variant="heading-compact-01" noWrap noMargin>
              Text
            </Typography>
            <IconButton type="lib_openclose_cancel" size="compact" iconSize="xs" onClick={() => handleNodeClick('')} />
          </Stack>
        </Stack>
      </CarbonPopoverContent>
    </CarbonPopover>
  );
}

interface NodeProps {
  selectedNodeId: string;
  node: BizOpsElkNode;
  handleNodeClick: (nodeId: string) => void;
  handlePaginateClick: (nodeId: string) => void;
}

export default function Node(props: NodeProps) {
  const { selectedNodeId, handleNodeClick, handlePaginateClick } = props;
  const { x, y, width, height, id, remainingTargetCount } = props.node;

  const onClick = bizopsProcessFlowMapHealthOverlayEnabled ? () => handleNodeClick(id) : undefined;

  return (
    <foreignObject transform={`translate(${x},${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <ProcessNode {...props.node} onClick={onClick} />
      <HealthOverlay selectedNodeId={selectedNodeId} nodeId={id} handleNodeClick={handleNodeClick} />
      <div className={classNames(local.paginationContainer, { [local.hidePagination]: remainingTargetCount === 0 })}>
        <Button
          className={local.paginationButton}
          kind="secondary"
          size="compact"
          hasIconOnly
          icon="lib_openclose_add"
          iconDescription={t('in-bizops:dashboards.flowMap.loadMore')}
          onClick={() => {
            handlePaginateClick(id);
          }}
        >
          {t('in-bizops:dashboards.flowMap.loadMore')}
        </Button>
      </div>
    </foreignObject>
  );
}
