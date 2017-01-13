import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-gravatar-url',

  getId(email) {
    return email;
  },

  getData(subscriptionId, email) {
    return {
      subscriptionId,
      email
    };
  }
});
