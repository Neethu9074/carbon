import { combineLatest } from 'reactive-observables';

import { getSnapshots, getPhysicalHierarchy } from 'in-stores/snapshot';
import { emptyArray } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import search from 'in-subscription/search';

export function getDropwizardWithContext(query) {
  return timeConfig$
    .flatMap(timeConfig =>
      search({
        query: query,
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'dropwizardApplicationContainer'
      })
        .flatMap(getSnapshots)
        .flatMap(dropwizardSnapshots =>
          combineLatest(
            dropwizardSnapshots.map(dropwizard =>
              getPhysicalHierarchy(dropwizard.get('id'), false)
                .flatMap(getSnapshots)
                .map(snapshots => {
                  return {
                    key: dropwizard.get('id'),
                    host: snapshots.find(s => s.getIn(['plugin']) === 'host'),
                    container: snapshots.find(s => s.getIn(['plugin']) === 'docker'),
                    jvm: snapshots.find(s => s.getIn(['plugin']) === 'jvmRuntimePlatform'),
                    dropwizard,
                    timeConfig
                  };
                })
                .filter(row => row.host != null && row.container != null)
            )
          )
        )
    )
    .startWith(emptyArray);
}
