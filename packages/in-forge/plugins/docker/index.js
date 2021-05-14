/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';

import { LoggingIntegrationButtonsRenderer, getObservables } from 'in-integrations/logging/LoggingIntegrationButtons';
import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import containerInfoButtonConfig from 'in-forge/plugins/docker/containerInfoButtonConfig';
import { addMaxValueLocator, addFormattedValueLocator } from 'in-sdk/metrics';
import metricDefinitions from 'in-forge/plugins/docker/metricDefinitions';
import tableDefinition from 'in-forge/plugins/docker/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/docker/kpiDefinitions';
import { getAnalyzeLogsHref$ } from 'in-forge/plugins/docker/util';
import { isWithinKubernetes } from 'in-forge/plugins/docker/util';
import { containerInfoEnabled } from 'in-services/featureFlags';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { hasRestrictedAccess } from 'in-stores/permission';
import { emptyMap } from 'in-services/fixedImmutables';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.docker,

  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'Labels']),
      Marathon: snapshot.getIn(['data', 'Marathon', 'labels'])
    });
  },

  getDashboardHeaderActions({ snapshot, timeConfig }) {
    return [
      {
        getObservables,
        render: LoggingIntegrationButtonsRenderer,
        props: {
          isWithinKubernetes: isWithinKubernetes(snapshot),
          dockerContainerId: snapshot.getIn(['data', 'Id']),
          timeConfig
        }
      },
      containerInfoEnabled && containerInfoAvailable(snapshot) && !hasRestrictedAccess && containerInfoButtonConfig
    ].filter(Boolean);
  },

  getAnalyzeLogsHref$
});

addMaxValueLocator(/^memory\.usage/, snapshot => snapshot.getIn(['data', 'memory.limit']));
addMaxValueLocator(/^cpu\.total_usage/, () => 1);

addFormattedValueLocator(
  /^memory\.usage/,
  // translates free -> used -> whateverBytes
  (max, value) => bytesTwoDecimalPlaces(value)
);

addFormattedValueLocator(
  /^cpu\.total_usage/,
  // translates free -> used -> whateverBytes
  (max, value) => percentageTwoDecimalPlaces(value)
);

function containerInfoAvailable(snapshot) {
  const labels = snapshot?.getIn(['data', 'Labels'], emptyMap);
  return !isServerless(labels);
}

function isServerless(labels) {
  // Containers monitored by serverless monitoring (via an in-process collector reporting to serverless-acceptor)
  // currently do not provide a backchannel, thus they do not have the container info button available.
  return isAwsFargate(labels);
}

function isAwsFargate(labels) {
  return labels.has('com.amazonaws.ecs.container-name') || labels.has('com.amazonaws.ecs.task-arn');
}
