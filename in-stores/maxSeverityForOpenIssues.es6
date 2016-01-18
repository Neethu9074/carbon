import {getSnapshot} from './snapshot';


export function getMaxSeverityForOpenIssues(snapshotId) {
  return getSnapshot(snapshotId)
    .map(() => {
      // TODO: implement logic here
      return 0;
    });
}
