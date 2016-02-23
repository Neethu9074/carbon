import createIssuesObservable from 'in-services/subscription/issues';

export function getIssues(snapshotId) {
  return createIssuesObservable(snapshotId);
}
