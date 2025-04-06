/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { Button, CarbonPopover, CarbonPopoverContent, Typography } from '@instana/components';
import { CardNode } from '@instana/carbon-charts';

import { BizOpsElkNode } from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMapPresenter';
import { bizopsProcessFlowMapHealthOverlayEnabled } from 'in-services/featureFlags';
import BizOpsOpenIssuesList from 'in-bizops/components/BizOpsOpenIssuesList';
import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import { millis } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import local from './Node.mless';

interface ProcessNodeProps {
  name: string;
  metrics: { [index: string]: number[][] };
  onClick: (() => void) | undefined;
}

function ProcessNode({ name, metrics, onClick }: ProcessNodeProps) {
  // Populate card with fetched metrics
  const count = metrics?.count?.[0] ? metrics.count[0][1] : 0;
  const errors = metrics?.erroneous_call_count?.[0] ? metrics.erroneous_call_count[0][1] : 0;
  const latency = metrics?.latency?.[0] ? millis.compact(metrics.latency[0][1]) : '0ms';

  // Determine border color based on health
  const maxSeverity = metrics?.maxSeverity?.[0][1] ?? 0;
  const cardColor = getDesignLibraryColorBySeverity(maxSeverity);

  // Only make nodes with health issues clickable
  const onClickHealthAware = maxSeverity > 0 && bizopsProcessFlowMapHealthOverlayEnabled ? onClick : undefined;

  return (
    <CardNode className={local.container} style={{ borderColor: cardColor }} onClick={onClickHealthAware}>
      <Tooltip content={name} align="topLeft">
        <div className={local.nodeName}>
          <Typography variant="heading-compact-02">{name}</Typography>
        </div>
      </Tooltip>
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

export interface BizOpsNodeProps extends BizOpsElkNode {
  onPaginate: () => void;
}

interface NodeProps {
  selectedNodeId: string;
  node: BizOpsElkNode;
  timeConfig: TimeConfig;
  inContentArea: boolean;
  handleNodeClick: (nodeId: string) => void;
  handlePaginateClick: (nodeId: string) => void;
}

export default function Node(props: NodeProps) {
  const { handlePaginateClick, handleNodeClick, selectedNodeId, timeConfig } = props;
  const { x, y, width, height, id, remainingTargetCount, endpointIds } = props.node;

  return (
    <foreignObject transform={`translate(${x},${y})`} height={height} width={width} style={{ overflow: 'visible' }}>
      <CarbonPopover className={local.carbonPopover} open={selectedNodeId === id}>
        <ProcessNode {...props.node} onClick={() => handleNodeClick(id)} />
        <CarbonPopoverContent>
          <BizOpsOpenIssuesList
            inContentArea
            timeConfig={timeConfig}
            endpointIds={endpointIds}
            close={() => handleNodeClick('')}
          />
        </CarbonPopoverContent>
      </CarbonPopover>
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
