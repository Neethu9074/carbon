/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';

import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import containerInfoButtonConfig from 'in-forge/plugins/crio/containerInfoButtonConfig';
import { addMaxValueLocator, addFormattedValueLocator } from 'in-sdk/metrics';
import metricDefinitions from 'in-forge/plugins/crio/metricDefinitions';
import { infrastructureAccessPermissions } from 'in-stores/permission';
import tableDefinition from 'in-forge/plugins/crio/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/crio/kpiDefinitions';
import { containerInfoEnabled } from 'in-services/featureFlags';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { hasAccess } from 'in-stores/useHasAccess';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.crio,

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

addMaxValueLocator(/^memory\.usage/, snapshot => snapshot.getIn(['data', 'memory.limit']));
addMaxValueLocator(/^cpu\.total/, () => 1);

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
