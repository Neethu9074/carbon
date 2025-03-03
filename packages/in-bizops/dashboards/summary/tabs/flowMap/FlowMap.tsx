/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import FlowMapPresenter from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMapPresenter';
import getBusinessFlowMap from 'in-bizops/subscriptions/getBusinessFlowMap';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function BusinessProcessFlowMap() {
  // add title, tabs, etc as required here
  return <FlowMapWrapper />;
}

export function FlowMapWrapper() {
  // graph-specific state management & top level layout
  const timeConfig = useTimeConfig();
  const location = useLocation();

  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');

  const businessFlowMapData = useObservable(
    getBusinessFlowMap({
      processDefinitionId: businessProcessId,
      nodePagination: {
        originNodeId: undefined,
        maxNodes: 50
      },
      timeConfig
    }),
    [timeConfig, businessProcessId]
  );

  return <FlowMapPresenter mapData={businessFlowMapData} />;
}
