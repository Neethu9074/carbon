import {combineLatest} from 'reactive-observables';

import {getRunningComponents} from 'in-stores/snapshot';
import {getClusterMembers} from 'in-stores/clusterMembers';

export default function getHostsInAvailabilityZone(zoneSnapshotId) {
  return getClusterMembers(zoneSnapshotId)
    .flatMap(hardwareSnapshotIds => {
      const hostSnapshotIdObservables$ = hardwareSnapshotIds
        .toArray()
        .map(hardwareSnapshotId => {
          return getRunningComponents(hardwareSnapshotId)
            .map(runningComponentIds => {
              if (runningComponentIds.size > 0) {
                return runningComponentIds.first();
              }
              return null;
            })
            .startWith(null);
        });

      return combineLatest(hostSnapshotIdObservables$)
        .map(hosts => hosts.filter(host => !!host));
    });
}
