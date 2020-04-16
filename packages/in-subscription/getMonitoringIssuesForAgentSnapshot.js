import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'getMonitoringIssuesForAgentSnapshot',

  getId({ timeConfig, snapshotId, pagination }) {
    return (
      generateStableHash(timeConfig) +
      Math.round(Date.now() / 2000) +
      snapshotId +
      pagination.cursor +
      pagination.retrievalSize
    );
  },

  memoizeFor: 100
});
