import iconPath from 'in-forge/plugins/hAProxy/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';


setHumanReadablePluginName(
  plugins.haproxy,
  'HAProxy',
  'HAProxy'
);

addLabelFinder(
  plugins.haproxy,
    snapshot => {
    const pid = snapshot.getIn(['data', 'pid']);
    return 'HAProxy @' + pid;
  }
);

addIconToRegistry({
  id: plugins.haproxy,
  image: iconPath
});

addSearchableEntityType('haproxy', plugins.haproxy);
