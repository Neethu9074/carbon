import createIssuesObservable from 'in-services/subscription/issues';

export function getIssues(timeframe) {
  return createIssuesObservable(timeframe);
}
