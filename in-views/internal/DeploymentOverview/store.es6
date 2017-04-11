import {combineLatest} from 'reactive-observables';

import search from 'in-services/subscription/search';
import {focusedMoment$} from 'in-stores/timeline';
import {getSnapshot} from 'in-stores/snapshot';

const dockerContainers$ = focusedMoment$
  .flatMap(time =>
    search({
      query: 'selfType:docker',
      time,
      view: 'TABLE'
    })
  )
  .flatMap(dockerSnapshotIds => combineLatest(dockerSnapshotIds.map(dockerSnapshotId =>
    getSnapshot(dockerSnapshotId).startWith(null)
  )))
  .map(dockerSnapshots => dockerSnapshots.filter(snapshot => snapshot))
  .throttle(500, {setTimeout, clearTimeout});

export const overview$ = dockerContainers$.map(dockerContainers => {
  const result = [];

  dockerContainers.forEach(dockerContainer => {
    const description = getDescription(dockerContainer);
    if (description) {
      result.push(description);
    }
  });

  return result;
});

function getDescription(docker) {
  const image = docker.getIn(['data', 'Image']);
  if (!image) {
    return null;
  }
  const imageMatch = image.match(/.*instana\/([^\/]+)\/([^\:]+):(.*)$/i);
  if (!imageMatch) {
    return null;
  }

  const taskName = docker.getIn(['data', 'Nomad', 'taskName']);
  if (!taskName) {
    return null;
  }
  const taskNameMatch = taskName.match(/([^-]+)-([^-]+)-(.*)/i);
  if (!taskNameMatch) {
    return null;
  }

  return {
    component: imageMatch[1],
    branch: imageMatch[2],
    dockerVersion: imageMatch[3],
    imageTag: docker.getIn(['data', 'Labels', 'com.instana.image.tag']),
    tenant: taskNameMatch[0],
    unit: taskNameMatch[1],
    commit: docker.getIn(['data', 'Labels', 'com.instana.commit.id']),
  };
}
