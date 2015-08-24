import * as pluginName from 'in-sdk/pluginName';
import {getFullSnapshot} from 'in-services/snapshots';
import * as zones from 'in-sdk/zones';

import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.ec2,
  'EC2 Instance',
  'EC2 Instances'
);

zones.addMapping(
  constants.plugins.ec2,
  coordinates => {
    return getFullSnapshot(coordinates).map(snapshot =>
      snapshot.getIn(['data', 'availability-zone']));
  }
);
