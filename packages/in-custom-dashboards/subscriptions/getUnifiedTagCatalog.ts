/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, GetUnifiedCatalogQuery, TagCatalog } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetUnifiedCatalogQuery, Result<TagCatalog>>({
  eventId: 'getUnifiedTagCatalog'
});
