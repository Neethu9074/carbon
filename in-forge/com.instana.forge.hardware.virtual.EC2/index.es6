import SnapshotsConveyer from 'in-services/conveyer/SnapshotsConveyer';
import * as pluginName from 'in-sdk/pluginName';
import {create} from 'in-services/conveyer';
import {only} from 'in-services/snapshots';
import * as zones from 'in-sdk/zones';

import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.ec2,
  'EC2 Instance',
  'EC2 Instances'
);

zones.addMapping(
  constants.plugins.ec2,
  (coordinates, callback) => {
    only(
        create(SnapshotsConveyer, {pluginId: coordinates.get('pluginId')}),
        coordinates)
        .subscribe(snapshot => {
          callback(snapshot.getIn(['data', 'availability-zone']));
        }
      );
  }
);
