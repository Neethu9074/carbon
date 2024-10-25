/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, GetInfraMetricsCatalogQuery, MetricCatalog, MetricTreeLevel } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { hiddenPlugins } from 'in-forge/constants';
import { mapData } from 'in-services/util/result';

export default createResultSubscriptionFactory<GetInfraMetricsCatalogQuery, Result<MetricCatalog>>({
  eventId: 'infrastructure.getMetricCatalog',
  mapResult: filterOutHiddenPlugins
});

function filterOutHiddenPlugins(result: Result<MetricCatalog>): Result<MetricCatalog> {
  result.data?.tree?.forEach(item =>
    item.children.splice(
      0,
      item.children.length,
      ...item.children.filter(
        e => e.type === 'LEVEL' && !hiddenPlugins.includes((e as MetricTreeLevel).levelType || '')
      )
    )
  );
  return mapData(result, data => ({
    list: data.list?.filter(item => !hiddenPlugins.includes(item.type || '')),
    tree: data.tree
  }));
}
