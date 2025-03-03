/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Result, GenerateActionQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface AIActionContent {
  content: string;
  inputTokenCount?: number;
  outputTokenCount?: number;
  totalTokenCount?: number;
}

export default createResultSubscriptionFactory<GenerateActionQuery, Result<AIActionContent>>({
  eventId: 'generateAIAction',
  memoizeFor: 0
});
