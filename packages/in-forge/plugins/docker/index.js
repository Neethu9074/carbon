import { Map } from 'immutable';

import { LoggingIntegrationButtonsRenderer, getObservables } from 'in-integrations/logging/LoggingIntegrationButtons';
import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import containerInfoButtonConfig from 'in-forge/plugins/docker/containerInfoButtonConfig';
import { addMaxValueLocator, addFormattedValueLocator } from 'in-sdk/metrics';
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
      containerInfoEnabled && !hasRestrictedAccess && containerInfoButtonConfig
    ].filter(Boolean);
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
