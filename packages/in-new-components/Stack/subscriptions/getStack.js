import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export const getStackForInfrastructure = createResultSubscriptionFactory({
  eventId: 'getStackForInfrastructure'
});

export const getStackForApplication = createResultSubscriptionFactory({
  eventId: 'getStackForApplication'
});

export const getStackForService = createResultSubscriptionFactory({
  eventId: 'getStackForService'
});
