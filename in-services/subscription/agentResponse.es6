import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-agent-response',

  getId,
  getData,
  transformData
});

function getId({ target, action, args }) {
  return target + action + JSON.stringify(args);
}

function getData(subscriptionId, { target, action, args }) {
  return {
    subscriptionId,
    action,
    target,
    args
  };
}

function transformData(data) {
  return data;
}
