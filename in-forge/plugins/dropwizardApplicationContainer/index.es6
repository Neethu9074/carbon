import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import tableDefinition from './tableDefinition';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.dropwizard,
  icon,
  metricDefinitions,
  tableDefinition,
  supportsCodeView,
  getCodeView,
  namesForTypeSearch: ['dropwizard'],
  pluginName: {
    singular: 'Dropwizard App',
    plural: 'Dropwizard Apps'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name'], '');
  }
});
