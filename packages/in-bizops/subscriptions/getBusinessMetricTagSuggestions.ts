/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetBusinessMetricsTagsSuggetionsQuery } from '@instana/types/typeDefinitions';
import { Result, TagSuggestions } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetBusinessMetricsTagsSuggetionsQuery, Result<TagSuggestions>>({
  eventId: 'getBusinessMetricsTagsSuggestions',
  trackSubscriptionStatistics: true
});
