import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-gravatar-url',

  getId(email) {
    return email;
  },

  // data to be send for subscription
  getData(subscriptionId, email) {
    return {
      subscriptionId,
      email
    };
  }
});
