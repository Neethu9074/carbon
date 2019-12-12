import React, { Fragment } from 'react';
import { Map } from 'immutable';

import ContainerInfoButton from 'in-forge/plugins/crio/ContainerInfoButton';
import metricDefinitions from 'in-forge/plugins/crio/metricDefinitions';
import tableDefinition from 'in-forge/plugins/crio/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/crio/kpiDefinitions';
import { containerInfoEnabled } from 'in-services/featureFlags';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { hasRestrictedAccess } from 'in-stores/permission';
import iconSvgPath from 'in-forge/plugins/crio/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.crio,
  pluginName: {
    singular: 'CRI-O Container',
    plural: 'CRI-O Containers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'labels'])
    });
  },

  DashboardHeaderActions({ snapshot }) {
    return (
      <Fragment>{containerInfoEnabled && !hasRestrictedAccess && <ContainerInfoButton snapshot={snapshot} />}</Fragment>
    );
  }
});
