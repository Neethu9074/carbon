import iconPath from 'in-forge/plugins/tomcatApplicationContainer/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


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

addIconToRegistry({
  id: plugins.tomcat,
  image: iconPath
});

addSearchableEntityType('tomcat', plugins.tomcat);
