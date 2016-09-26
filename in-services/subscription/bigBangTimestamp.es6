import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-big-bang-timestamp',

  getId: () => 'big-bang-timestamp',

  getData: (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  transformData: timestamp => timestamp
});
