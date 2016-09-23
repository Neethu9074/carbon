import icon from 'in-forge/plugins/glassfishApplicationContainer/icon.svg';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';


registerSnapshotDefinition({
  plugin: plugins.glassfish,
  icon,

  pluginName: {
    singular: 'Glassfish',
    plural: 'Glassfish'
  },

  namesForTypeSearch: ['glassfish'],

  getLabel(snapshot) {
    return 'Glassfish ' + snapshot.getIn(['data', 'version']);
  }
});
