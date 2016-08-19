import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder, getLabel} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.webAppServiceInstance,
  'WebApp Instance',
  'WebApp Instances'
);

addLabelFinder(
  constants.plugins.webAppServiceInstance,
  snapshot => {
    const name = snapshot.getIn(['data', 'name']);
    if (/^PID \d+/i.test(name)) {
      // label would be shitty, try to find a matching label using the embedded component snapshot

      const component = snapshot.getIn(['embedded', 'component']);
      if (component) {
        return getLabel(component, name);
      }
    }

    return name;
  }
);

addIconToRegistry({
  id: constants.plugins.webAppServiceInstance,
  image: iconPath
});
