/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetTagSuggestionsQuery, Result, TagSuggestions } from 'in-types';

export default createResultSubscriptionFactory<GetTagSuggestionsQuery, Result<TagSuggestions>>({
  eventId: 'getSubtraceTagSuggestion',
  memoizeFor: 5000,
  trackSubscriptionStatistics: true
});
