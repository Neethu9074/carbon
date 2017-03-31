import createTotalRawEventsSubscription from 'in-services/subscription/totalRawEventsCount';
import { timeframe$ } from 'in-stores/timeline';

export default function getTotalRawEventsCount() {
  return timeframe$.flatMap(timeframe => createTotalRawEventsSubscription({ timeframe }));
}
