/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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

export const getStackForEndpoint = createResultSubscriptionFactory({
  eventId: 'getStackForEndpoint',
  trackSubscriptionStatistics: true
});

export const getStackForBusinessProcess = createResultSubscriptionFactory({
  eventId: 'getStackForBusinessProcess',
  trackSubscriptionStatistics: true
});

export const getStackForBusinessActivity = createResultSubscriptionFactory({
  eventId: 'getStackForBusinessActivity',
  trackSubscriptionStatistics: true
});
