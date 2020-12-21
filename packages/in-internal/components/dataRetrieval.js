import { combineLatest } from '@instana/observables';

import getPhysicalHierarchy from 'in-subscription/physicalHierarchy';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateStableHash } from 'in-services/util/id';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';

export const getPhysicalStack = memoize(getPhysicalStackInternal, generateStableHash, 1000);

function getPhysicalStackInternal({ searchQuery, timeConfig, restrictResultEntityType }) {
  // search for snapshot IDs
  return (
    search({
      query: searchQuery,
      view: 'TABLE',
      timeConfig,
      restrictResultEntityType
    })
      // prepare retrieval of physical hierarchy for every result
      .map(snapshotIds =>
        snapshotIds.map(snapshotId =>
          getPhysicalHierarchy({
            snapshotId,
            timeConfig,
            includeCluster: false
          })
        )
      )
      // retrieve physical hierarchy for every result
      .flatMap(hierarchies => combineLatest(hierarchies, false))
      .throttle(500)
      // drop all incomplete results
      .map(hierarchies => hierarchies.filter(Boolean))
      // retrieve snapshots for every hierarchy. We need to wait for completion of an individual hierarchy
      // to make internal dashboard development easier
      .map(hierarchies => hierarchies.map(hierarchy => getSnapshots(hierarchy, { waitForCompletion: true })))
      .flatMap(hierarchies => combineLatest(hierarchies, false))
      .throttle(500)
      // drop all incomplete results
      .map(hierarchies => hierarchies.filter(Boolean))
      // change the structure of the hierarchy objects to make it easier to build internal dashboards.
      .map(hierarchies => hierarchies.map(turnHierarchyIntoObject))
  );
}

function turnHierarchyIntoObject(snapshots) {
  const result = {};
  snapshots.forEach(snapshot => {
    result[snapshot.get('plugin')] = snapshot;
  });
  return result;
}
