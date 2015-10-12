/*eslint-disable no-console*/

import _ from 'lodash';
import * as ro from 'reactive-observables';

import {create} from 'in-services/conveyer';
import SnapshotsConveyer from 'in-services/conveyer/SnapshotsConveyer';
import {getStructure} from 'in-services/wiring';
import view from 'in-services/views';

window.instana.dev.checkForWiringIssues = function() {
  console.log('Starting to check for wiring issues…');

  getStructure(view.physical)
    .transform({
      emitLatestOnSubscribe: true,

      transform(viewStructure) {
        let wiredSnapshotIds = [];
        let plugins = [];

        viewStructure.forEach(nodeStructure => {
          if (nodeStructure.group) {
            wiredSnapshotIds.push(nodeStructure.group.get('id'));
            plugins.push(nodeStructure.group.get('pluginId'));
          }
          wiredSnapshotIds.push(nodeStructure.node.get('id'));
          plugins.push(nodeStructure.node.get('pluginId'));

          nodeStructure.layers.forEach(layer => {
            wiredSnapshotIds.push(layer.get('id'));
            plugins.push(layer.get('pluginId'));
          });
        });

        wiredSnapshotIds = _.uniq(wiredSnapshotIds).sort();
        plugins = _.uniq(plugins).sort();

        return ro.combineLatest(plugins.map(pluginId => {
            return create(SnapshotsConveyer, {pluginId});
          }))
          .map(snapshotsList => {
            const foundSnapshots = [];

            snapshotsList.forEach(snapshots => {
              snapshots.forEach(snapshot => {
                foundSnapshots.push(snapshot.get('id'));
              });
            });

            // console.log(foundSnapshots.sort());
            // console.log(wiredSnapshotIds.sort());
            return _.without(wiredSnapshotIds, foundSnapshots);
          });
      }
    })
    .subscribe(unavailableSnapshots => {
      console.log(
        'The following snapshots could not be found:\n',
        unavailableSnapshots.join('\n')
      );
      console.log('Done!');
    });
};
