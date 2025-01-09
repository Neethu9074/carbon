/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import FlowMapPresenter from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMapPresenter';

export default function BusinessProcessFlowMap() {
  // add title, tabs, etc as required here
  return <FlowMapWrapper />;
}

export function FlowMapWrapper() {
  // graph-specific state management & top level layout
  return <FlowMapPresenter />;
}
