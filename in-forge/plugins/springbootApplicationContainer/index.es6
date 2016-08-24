import iconPath from 'in-forge/plugins/springbootApplicationContainer/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

setHumanReadablePluginName(
  plugins.springboot,
  'Springboot',
  'Springboot'
);

addLabelFinder(
  plugins.springboot,
  snapshot => {
    const data = snapshot.get('data');
    const portsMap = data.get('ports');
    const appName = data.get('name');
    const version = data.get('version');
    let label = 'Springboot';
    if (appName) {
      label = appName;
      if (version) {
        label += ' ' + version;
      }
    }
    if (portsMap && portsMap.size > 0) {
      const ports = portsMap.valueSeq().join(', ');
      label += ' @' + ports;
    }
    return label;
  }
);

addIconToRegistry({
  id: plugins.springboot,
  image: iconPath
});


addSearchableEntityType('springboot', plugins.springboot);
