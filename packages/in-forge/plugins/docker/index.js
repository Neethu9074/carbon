import React, { Fragment } from 'react';
import { Map } from 'immutable';

import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import LoggingIntegrationButtons from 'in-integrations/logging/LoggingIntegrationButtons';
import { addMaxValueLocator, addFormattedValueLocator } from 'in-sdk/metrics';
import ContainerInfoButton from 'in-forge/plugins/docker/ContainerInfoButton';
import metricDefinitions from 'in-forge/plugins/docker/metricDefinitions';
import tableDefinition from 'in-forge/plugins/docker/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/docker/kpiDefinitions';
import { isWithinKubernetes } from 'in-forge/plugins/docker/util';
import { containerInfoEnabled } from 'in-services/featureFlags';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/docker/iconPath';
import { hasRestrictedAccess } from 'in-stores/permission';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.docker,
  pluginName: {
    singular: 'Docker Container',
    plural: 'Docker Containers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'Labels']),
      Marathon: snapshot.getIn(['data', 'Marathon', 'labels'])
    });
  },

  DashboardHeaderActions({ snapshot, timeConfig }) {
    return (
      <Fragment>
        <LoggingIntegrationButtons
          isWithinKubernetes={isWithinKubernetes(snapshot)}
          dockerContainerId={snapshot.getIn(['data', 'Id'])}
          timeConfig={timeConfig}
        />
        {containerInfoEnabled && !hasRestrictedAccess && <ContainerInfoButton snapshot={snapshot} />}
      </Fragment>
    );
  }
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
