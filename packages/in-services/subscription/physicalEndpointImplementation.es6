import createSubscription from 'in-services/subscription/subscription';
import { roundToNearestTimeBlock } from 'in-services/subscription/util';

export default createSubscription({
  eventId: 'subscribe-physical-endpoint-implementation',

  getId({ time, physicalEndpoint }) {
    return roundToNearestTimeBlock(time) + JSON.stringify(physicalEndpoint);
  },

  getData(subscriptionId, { time, physicalEndpoint }) {
    return {
      subscriptionId,
      time: roundToNearestTimeBlock(time),
      physicalEndpoint
    };
  }
});
