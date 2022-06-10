/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ErrorMessageItem, GetErrorMessagesQuery, PaginatedResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetErrorMessagesQuery, Result<PaginatedResult<ErrorMessageItem>>>({
  eventId: 'getErrorMessages',
  trackSubscriptionStatistics: true
});
