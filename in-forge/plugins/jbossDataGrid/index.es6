import iconPath from 'in-forge/plugins/jbossDataGrid/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {emptyMap} from 'in-services/fixedImmutables';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


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

addIconToRegistry({
  id: constants.plugins.jbossdatagrid,
  image: iconPath
});

addSearchableEntityType('jdg', constants.plugins.jbossdatagrid);
addSearchableEntityType('jbdg', constants.plugins.jbossdatagrid);
