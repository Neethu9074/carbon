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
    const fallback = snapshot.getIn(['data', 'name']);

    const service = snapshot.getIn(['embedded', 'service']);
    if (!service) {
      return fallback;
    }

    return getLabel(service, fallback);
  }
);

addIconToRegistry({
  id: constants.plugins.webAppServiceInstance,
  image: iconPath
});
