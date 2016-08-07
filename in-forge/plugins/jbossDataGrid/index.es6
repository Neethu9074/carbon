import iconPath from 'in-forge/plugins/jbossDataGrid/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {emptyMap} from 'in-services/fixedImmutables';
import {addSearchableType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';


pluginName.setHumanReadablePluginName(
  constants.plugins.jbossdatagrid,
  'Jboss Data Grid',
  'Jboss Data Grids'
);

addLabelFinder(
  constants.plugins.jbossdatagrid,
  snapshot => {
    let label = 'Jboss Data Grid';
    const ports = snapshot.getIn(['data', 'ports'], emptyMap);
    if (ports) {
      label += ' @' + ports.toList().join(', ');
    }
    return label;
  }
);

power.addMapping(
  constants.plugins.jbossdatagrid,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.jbossdatagrid,
  image: iconPath
});

addSearchableType('jdg', constants.plugins.jbossdatagrid);
addSearchableType('jbdg', constants.plugins.jbossdatagrid);
