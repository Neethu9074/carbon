import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export const getStackForInfrastructure = createResultSubscriptionFactory({
  eventId: 'getStackForInfrastructure',
  trackSubscriptionStatistics: true
});

export const getStackForApplication = createResultSubscriptionFactory({
  eventId: 'getStackForApplication',
  trackSubscriptionStatistics: true
});

export const getStackForService = createResultSubscriptionFactory({
  eventId: 'getStackForService',
  trackSubscriptionStatistics: true
});
