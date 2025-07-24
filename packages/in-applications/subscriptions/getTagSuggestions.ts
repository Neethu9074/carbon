/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetTagSuggestionsQuery, Result, TagSuggestions } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetTagSuggestionsQuery, Result<TagSuggestions>>({
  eventId: 'getTagSuggestions',
  memoizeFor: 5000,
  trackSubscriptionStatistics: true
});
