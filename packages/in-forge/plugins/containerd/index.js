/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Map } from 'immutable';
import React from 'react';

import { LoggingIntegrationButtonsRenderer, getObservables } from 'in-integrations/logging/LoggingIntegrationButtons';
import containerInfoButtonConfig from 'in-forge/plugins/containerd/containerInfoButtonConfig';
import metricDefinitions from 'in-forge/plugins/containerd/metricDefinitions';
import tableDefinition from 'in-forge/plugins/containerd/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/containerd/kpiDefinitions';
import { isWithinKubernetes } from 'in-forge/plugins/containerd/util';
import { containerInfoEnabled } from 'in-services/featureFlags';
import { hasInfrastructureAccess } from 'in-stores/permission';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.containerd,

  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'labels'])
    });
  },
  getDashboardHeaderActions({ snapshot, timeConfig }) {
    return [
      {
        getObservables,
        render: props => <LoggingIntegrationButtonsRenderer {...props} addMargin />,
        props: {
          isWithinKubernetes: isWithinKubernetes(snapshot),
          dockerContainerId: snapshot.getIn(['data', 'id']),
          timeConfig
        }
      },
      containerInfoEnabled && containerInfoAvailable(snapshot) && hasInfrastructureAccess && containerInfoButtonConfig
    ].filter(Boolean);
  }
});

function containerInfoAvailable(snapshot) {
  const hostId = snapshot?.getIn(['entityId', 'host']);
  return !isServerless(hostId);
}

function isServerless(hostId) {
  // Containers monitored by serverless monitoring (via an in-process collector reporting to serverless-acceptor)
  // currently do not provide a backchannel, thus they do not have the container info button available.
  return isAwsFargate(hostId);
}

function isAwsFargate(hostId) {
  // When running in AWS Fargate the host id of Docker sensor will be the Task's ARN.
  return hostId.startsWith('arn:aws:ecs') || !hostId;
}
