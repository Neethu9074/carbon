import createIssuesObservable from 'in-services/subscription/historicalIssues';

export function getHistoricalIssues(timeframe) {
  return createIssuesObservable(timeframe);
}
