import React, { Fragment } from 'react';
import { Map } from 'immutable';

import ContainerInfoButton from 'in-forge/plugins/crio/ContainerInfoButton';
import tableDefinition from 'in-forge/plugins/crio/tableDefinition';
import { containerInfoEnabled } from 'in-services/featureFlags';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { hasRestrictedAccess } from 'in-stores/permission';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/crio/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.crio,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  pluginName: {
    singular: 'CRI-O Container',
    plural: 'CRI-O Containers'
  },

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
