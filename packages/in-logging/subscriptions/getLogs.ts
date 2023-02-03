/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import {LogsQuery, LogsResult, Result} from '@instana/types';

export default createResultSubscriptionFactory<LogsQuery, Result<LogsResult>>({
  eventId: 'logs.getLogs'
});
