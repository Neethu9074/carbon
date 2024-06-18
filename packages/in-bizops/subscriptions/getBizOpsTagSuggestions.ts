/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Result, TagSuggestions } from '@instana/types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetBizOpsTagSuggestionQuery } from 'in-bizops/utils/types';

export default createResultSubscriptionFactory<GetBizOpsTagSuggestionQuery, Result<TagSuggestions>>({
  eventId: 'getBizOpsTagSuggestions',
  trackSubscriptionStatistics: true
});
