import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'subscribe-raw-events',

  getId({ timeConfig, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset, size }) {
    return (
      generateStableHash(timeConfig) +
      maxTimestamp +
      minTimestamp +
      sortByField +
      sortMode +
      Math.round(Date.now() / 2000) +
      query +
      offset +
      size
    );
  },

  memoizeFor: 100
});
