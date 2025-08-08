/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Map } from 'immutable';

import containerInfoButtonConfig from 'in-forge/plugins/podman/containerInfoButtonConfig';
import metricDefinitions from 'in-forge/plugins/podman/metricDefinitions';
import { infrastructureAccessPermissions } from 'in-stores/permission';
import tableDefinition from 'in-forge/plugins/podman/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/podman/kpiDefinitions';
import { containerInfoEnabled } from 'in-services/featureFlags';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { hasAccess } from 'in-stores/useHasAccess';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.podman,

  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'labels'])
    });
  },

  getDashboardHeaderActions(_, role) {
    const hasInfrastructureAccess = hasAccess({
      grantedPermissions: role?.permissions ?? [],
      requiredPermissions: infrastructureAccessPermissions
    });
    return containerInfoEnabled && hasInfrastructureAccess ? [containerInfoButtonConfig] : [];
  }
});
