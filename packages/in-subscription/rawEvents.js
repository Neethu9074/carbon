import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'subscribe-raw-events',

  getId({ timeConfig, query, pagination, order }) {
    return (
      generateStableHash(timeConfig) +
      order.by +
      order.direction +
      Math.round(Date.now() / 2000) +
      query +
      pagination.cursor +
      pagination.retrievalSize
    );
  },

  memoizeFor: 100
});
