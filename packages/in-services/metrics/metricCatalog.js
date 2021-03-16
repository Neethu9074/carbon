/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateStableHash } from 'in-services/util/id';
import { roundDownToWeek } from 'in-services/util/date';
import { success } from 'in-services/util/result';

// We frequently need to access the metric catalog in ways that would be unoptimized
// given its native structure. We therefore index it in a variety of different
// ways in order to allow faster execution within the components.
export function enrichMetricCatalog(metricCatalog) {
  if (metricCatalog.__enriched) {
    // To allow methods to either work with enriched or un-enriched metric catalogs
    // without a runtime performance impact for optimized code paths.
    return metricCatalog;
  }

  // Create a shallow copy to allow us to add additional properties.
  metricCatalog = {
    __enriched: true,
    ...metricCatalog
  };

  metricCatalog.metrics = metricCatalog.tree.reduce((categories, category) => {
    categories[category.label] = category.children.reduce((types, type) => {
      types[type.children[0].type] = type.children.reduce((metrics, metric) => {
        metrics[metric.name] = metric;
        return metrics;
      }, {});
      return types;
    }, {});
    return categories;
  }, {});

  metricCatalog.types = metricCatalog.tree.reduce((categories, category) => {
    categories[category.label] = category.children.reduce((types, type) => {
      types[type.children[0].type] = type;
      return types;
    }, {});
    return categories;
  }, {});

  return metricCatalog;
}

export function getMetricCatalogOnce(originalGetMetricCatalog) {
  return memoize(
    args =>
      originalGetMetricCatalog(args).map(result => {
        if (result.data) {
          return success(enrichMetricCatalog(result.data));
        }
        return result;
      }),
    generateGetMetricCatalogRequestId,
    Number.MAX_VALUE
  );
}

function generateGetMetricCatalogRequestId({ timeConfig }) {
  const from = (timeConfig.to || Date.now()) - timeConfig.windowSize;
  const week = roundDownToWeek(from);
  return generateStableHash(week);
}
