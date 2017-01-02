import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from './iconPath';


registerSnapshotDefinition({
  plugin: plugins.logicalWebApp,

  iconSvgPath,
  namesForTypeSearch: ['service'],
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'WebApp',
    plural: 'WebApps'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
