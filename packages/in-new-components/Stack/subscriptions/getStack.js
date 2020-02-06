import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export const getStack = createResultSubscriptionFactory({
  eventId: 'getStack'
});

export const getStackForApplication = createResultSubscriptionFactory({
  eventId: 'getStackForApplication'
});

export const getStackForService = createResultSubscriptionFactory({
  eventId: 'getStackForService'
});
