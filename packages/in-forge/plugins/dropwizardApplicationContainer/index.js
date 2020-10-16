import metricDefinitions from 'in-forge/plugins/dropwizardApplicationContainer/metricDefinitions';
import tableDefinition from 'in-forge/plugins/dropwizardApplicationContainer/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/dropwizardApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.dropwizardApplicationContainer,
  pluginName: {
    singular: 'Dropwizard App',
    plural: 'Dropwizard Apps'
  },
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Dropwizard'
  }
});
