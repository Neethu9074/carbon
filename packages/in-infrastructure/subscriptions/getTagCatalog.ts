/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetInfraTagCatalogQuery, Result, TagCatalog } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetInfraTagCatalogQuery, Result<TagCatalog>>({
  eventId: 'infrastructure.getTagCatalog'
});
