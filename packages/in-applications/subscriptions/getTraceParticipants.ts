/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { PaginatedResult, GetTraceParticipantsQuery, TraceParticipant, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetTraceParticipantsQuery, Result<PaginatedResult<TraceParticipant>>>({
  eventId: 'getTraceParticipants',
  trackSubscriptionStatistics: true
});

// TODO move to analyze
