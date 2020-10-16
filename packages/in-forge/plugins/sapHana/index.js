import metricDefinitions from 'in-forge/plugins/sapHana/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/sapHana/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.sapHana,
  pluginName: {
    singular: 'SAP HANA',
    plural: 'SAP HANA'
  },
  kpiDefinitions,
  metricDefinitions
});
