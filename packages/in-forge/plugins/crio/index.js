/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';

import containerInfoButtonConfig from 'in-forge/plugins/crio/containerInfoButtonConfig';
import metricDefinitions from 'in-forge/plugins/crio/metricDefinitions';
import tableDefinition from 'in-forge/plugins/crio/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/crio/kpiDefinitions';
import { containerInfoEnabled } from 'in-services/featureFlags';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { hasRestrictedAccess } from 'in-stores/permission';
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

  getDashboardHeaderActions() {
    return containerInfoEnabled && !hasRestrictedAccess ? [containerInfoButtonConfig] : [];
  }
});
