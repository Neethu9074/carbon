/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { generateStableHash } from '@instana/utils';
import { Observable } from '@instana/observables';

import {
  MetricTreeMetric,
  Metric,
  MetricCatalog,
  MetricTreeLevel,
  MetricTreeNodeUnion,
  Result,
  GetInfraMetricsCatalogQuery
} from 'in-types';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { roundDownToWeek } from 'in-services/util/date';
import { success } from 'in-services/util/result';

export type GetMetricCatalog = (query: GetInfraMetricsCatalogQuery) => Observable<Result<MetricCatalog>>;

// We frequently need to access the metric catalog in ways that would be unoptimized
// given its native structure. We therefore index it in a variety of different
// ways in order to allow faster execution within the components.
export function enrichMetricCatalog(
  metricCatalog: MetricCatalog,
  withHierarchy: boolean = false,
  type?: string
): EnrichedMetricCatalog {
  return {
    list: metricCatalog.list && filterList(metricCatalog.list, type),
    tree: metricCatalog.tree && filterTree(metricCatalog.tree, withHierarchy, type),
    //TODO are these really needed anywhere ?
    metrics: (metricCatalog.tree && metricCategories(metricCatalog.tree)) || {},
    types: (metricCatalog.tree && metricTypes(metricCatalog.tree)) || {}
  };
}

type EnrichedMetricCatalog = MetricCatalog & {
  metrics: MetricCategories;
  types: CategoriesByMetricLevels;
};

type MetricTreeMetricByMetric = { [metric: string]: MetricTreeMetric };
type MetricTypes = { [type: string]: MetricTreeMetricByMetric };
type MetricCategories = { [category: string]: MetricTypes };
type MetricLevelsByMetric = { [metric: string]: MetricTreeLevel };
type CategoriesByMetricLevels = { [metric: string]: MetricLevelsByMetric };

function metricCategories(tree: MetricTreeLevel[]): MetricCategories {
  return tree.reduce((categories, category) => {
    categories[category.label] = category.children.reduce((types, type) => {
      if (type.type === 'LEVEL') {
        types[type.children[0].type] = type.children.reduce((metrics, metric) => {
          if (metric.type === 'METRIC') {
            metrics[metric.name] = metric;
          }
          return metrics;
        }, {} as MetricTreeMetricByMetric);
      }
      return types;
    }, {} as MetricTypes);
    return categories;
  }, {} as MetricCategories);
}

function metricTypes(tree: MetricTreeLevel[]): CategoriesByMetricLevels {
  return tree.reduce((categories, category) => {
    categories[category.label] = category.children.reduce((types, type) => {
      if (type.type === 'LEVEL') {
        types[type.children[0].type] = type;
      }
      return types;
    }, {} as MetricLevelsByMetric);
    return categories;
  }, {} as CategoriesByMetricLevels);
}

export function getMetricCatalogOnce(
  originalGetMetricCatalog: GetMetricCatalog,
  withHierarchy: boolean = false,
  type?: string
): GetMetricCatalog {
  return memoize(
    query =>
      originalGetMetricCatalog(query).map(result => {
        if (result.data) {
          return success(enrichMetricCatalog(result.data, withHierarchy, type));
        }
        return result;
      }),
    generateGetMetricCatalogRequestId,
    Number.MAX_VALUE
  );
}

function generateGetMetricCatalogRequestId(query: GetInfraMetricsCatalogQuery) {
  const timeConfig = query.filter.timeConfig;
  const from = (timeConfig.to || Date.now()) - timeConfig.windowSize;
  const week = roundDownToWeek(from);
  return generateStableHash(week);
}

function filterList(list: Metric[], type?: string): Metric[] {
  if (type) {
    return list.filter(metric => metric.type === type);
  }
  return list;
}

function filterTree(level: MetricTreeLevel[], withHierarchy: boolean, type?: string): MetricTreeLevel[] {
  if (type) {
    return (filterLevel(level, withHierarchy, type) as MetricTreeLevel[]) || [];
  }
  return level;
}

function filterLevel(
  level: MetricTreeNodeUnion[],
  withHierarchy: boolean,
  type?: string
): MetricTreeNodeUnion[] | undefined {
  const nodes = level
    .map(l => {
      switch (l.type) {
        case 'LEVEL':
          return {
            ...l,
            children: filterLevel(l.children, withHierarchy, type) || []
          };
        case 'METRIC':
          return l;
      }
    })
    .filter(l => {
      switch (l.type) {
        case 'LEVEL':
          return l.children.length > 0;
        case 'METRIC':
          return l.parentType === type;
      }
    });
  if (nodes.length == 0) {
    return undefined;
  } else if (!withHierarchy && nodes.length == 1 && nodes[0].type === 'LEVEL') {
    return nodes[0].children;
  } else {
    return nodes;
  }
}
