import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-message',

  getId: () => 'messageSubscription',

  getData: subscriptionId => {
    return {
      subscriptionId
    };
  },

  transformData: message => message
});
