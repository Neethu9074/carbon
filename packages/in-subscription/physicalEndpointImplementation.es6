import { roundToNearestTimeBlock } from 'in-subscription/util';
import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'subscribe-physical-endpoint-implementation',

  getId({ timeConfig, physicalEndpoint }) {
    return generateStableHash(roundToNearestTimeBlock(timeConfig)) + generateStableHash(physicalEndpoint);
  },

  getData(subscriptionId, { timeConfig, physicalEndpoint }) {
    return {
      subscriptionId,
      timeConfig: roundToNearestTimeBlock(timeConfig),
      physicalEndpoint
    };
  }
});
