/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { GetTestResultMetadataQuery, PaginatedResult, Result, TestResultDetailData } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getTestResultSubtransactions = createResultSubscriptionFactory<
  GetTestResultMetadataQuery,
  Result<PaginatedResult<TestResultDetailData>>
>({
  eventId: 'getTestResultSubtransactions',
  trackSubscriptionStatistics: true
});

export default getTestResultSubtransactions;
