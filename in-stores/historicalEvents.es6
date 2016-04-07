import createEventObservable from 'in-services/subscription/historicalEvents';

export function getHistoricalEvents(timeframe) {
  return createEventObservable(timeframe);
}
