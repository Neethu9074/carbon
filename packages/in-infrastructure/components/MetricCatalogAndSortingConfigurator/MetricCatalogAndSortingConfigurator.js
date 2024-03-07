/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import MetricCatalogConfigurator from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfigurator';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import TagCatalogConfigurator from 'in-infrastructure/components/TagCatalogConfigurator/TagCatalogConfigurator';
import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';
import { infrastructureExploreTagColumnsEnabled } from 'in-services/featureFlags';

import locals from './MetricCatalogAndSortingConfigurator.mless';

export default function MetricCatalogAndSortingConfigurator({
  sortOptions,
  order,
  setOrder,
  metrics,
  setMetrics,
  tags,
  setTags,
  tracking,
  MetricConfiguratorHint,
  query,
  onQueryChange,
  metricCatalog,
  tagCatalog,
  type,
  metricMetadatas,
  showTagCatalog: showTagCatalogExternal = true
}) {
  const isInternalVisible = useObservable(isInternalVisible$, []) || false;
  const showTagCatalog = showTagCatalogExternal && (infrastructureExploreTagColumnsEnabled || isInternalVisible);
  return (
    <div className={locals.wrapper}>
      {showTagCatalog && (
        <TagCatalogConfigurator
          values={tags}
          onChange={setTags}
          tracking={tracking}
          query={query}
          onQueryChange={onQueryChange}
          tagCatalog={tagCatalog}
          type={type}
        />
      )}
      <MetricCatalogConfigurator
        values={metrics}
        onChange={setMetrics}
        tracking={tracking}
        MetricConfiguratorHint={MetricConfiguratorHint}
        query={query}
        onQueryChange={onQueryChange}
        metricCatalog={metricCatalog}
        type={type}
        metricMetadatas={metricMetadatas}
      />
      {sortOptions && <SortingConfigurator options={sortOptions} orderBy={order} onChange={setOrder} />}
    </div>
  );
}
