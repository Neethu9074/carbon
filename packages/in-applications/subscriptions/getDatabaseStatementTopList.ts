/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DatabaseStatementTopListItem, GetDatabaseStatementTopListQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetDatabaseStatementTopListQuery,
  Result<DatabaseStatementTopListItem[]>
>({
  eventId: 'getDatabaseStatementTopList',
  trackSubscriptionStatistics: true
});
