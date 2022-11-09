/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { GetTestResultDetailDataQuery, PaginatedResult, Result, TestResultDetailData } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getTestResultDetailData = createResultSubscriptionFactory<
  GetTestResultDetailDataQuery,
  Result<PaginatedResult<TestResultDetailData>>
>({
  eventId: 'getTestResultDetailData',
  trackSubscriptionStatistics: true
});

export default getTestResultDetailData;
