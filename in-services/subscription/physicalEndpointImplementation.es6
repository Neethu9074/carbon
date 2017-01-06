import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-physical-endpoint-implementation',

  getId: ({time, physicalEndpoint}) => time + JSON.stringify(physicalEndpoint),

  getData: (subscriptionId, {time, physicalEndpoint}) => {
    return {
      subscriptionId,
      time,
      physicalEndpoint
    };
  }
});
