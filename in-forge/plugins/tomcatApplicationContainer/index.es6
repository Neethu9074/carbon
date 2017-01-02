import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import iconSvgPath from './iconPath';


registerSnapshotDefinition({
  plugin: plugins.tomcat,

  iconSvgPath,
  supportsCodeView,
  getCodeView
});


setHumanReadablePluginName(
  plugins.tomcat,
  'Tomcat Server',
  'Tomcat Servers'
);

addLabelFinder(
  plugins.tomcat,
  // Version usually looks like "Apache Tomcat/7.0"
  // So it is enough to take version + ports
  snapshot => {
    let label = snapshot.getIn(['data', 'version']);

    const connectorConfig = snapshot.getIn(['data', 'connector-config']);
    if (connectorConfig && connectorConfig.size > 0) {
      label += ' @ ' + snapshot.getIn(['data', 'connector-config'])
        .map(data => data.getIn(['port'])).join(',');
    }
    return label;
  }
);

addSearchableEntityType('tomcat', plugins.tomcat);
