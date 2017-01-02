import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.sdkLogicalService,

  iconSvgPath,
  metricDefinitions,
  namesForTypeSearch: ['service'],
  tableDefinition,

  pluginName: {
    singular: 'Unspecified Custom Service',
    plural: 'Unspecified Custom Services'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
