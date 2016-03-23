import createIssuesObservable from 'in-services/subscription/openIssues';

export function getOpenIssues() {
  return createIssuesObservable();
}
