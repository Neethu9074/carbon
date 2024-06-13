/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetBizOpsTagSuggestionQuery } from 'in-bizops/types';
import { Result, TagSuggestions } from 'in-types';

export default createResultSubscriptionFactory<GetBizOpsTagSuggestionQuery, Result<TagSuggestions>>({
  eventId: 'getBizOpsTagSuggestions',
  trackSubscriptionStatistics: true
});
