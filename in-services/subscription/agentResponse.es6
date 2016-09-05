import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-agent-response',

  // getID
  ({action, target, args}) => action + JSON.stringify(target.toJS()) + JSON.stringify(args),

  // data to be send for subscription
  (subscriptionId, {target, action, args}) => {
    return {
      subscriptionId,
      target: target.toJS(),
      action,
      args
    };
  },

  // data transformation on onData
  x => x,

  // memoize only for three seconds
  0
);
