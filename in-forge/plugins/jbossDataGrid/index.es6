import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {emptyMap} from 'in-services/fixedImmutables';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';



registerSnapshotDefinition({
  plugin: plugins.jbossdatagrid,

  iconSvgPath,
  metricDefinitions
});


setHumanReadablePluginName(
  plugins.jbossdatagrid,
  'Jboss Data Grid',
  'Jboss Data Grids'
);

addLabelFinder(
  plugins.jbossdatagrid,
  snapshot => {
    let label = 'Jboss Data Grid';
    const ports = snapshot.getIn(['data', 'ports'], emptyMap);
    if (ports) {
      label += ' @' + ports.toList().join(', ');
    }
    return label;
  }
);

addSearchableEntityType('jdg', plugins.jbossdatagrid);
addSearchableEntityType('jbdg', plugins.jbossdatagrid);
