/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetInfraTagCatalogQuery, Result, TagCatalog } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetInfraTagCatalogQuery, Result<TagCatalog>>({
  eventId: 'infrastructure.getTagCatalog'
});
