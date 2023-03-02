/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LogTagSuggestionsQuery, Result, TagSuggestions } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<LogTagSuggestionsQuery, Result<TagSuggestions>>({
  eventId: 'logs.getTagSuggestions'
});
