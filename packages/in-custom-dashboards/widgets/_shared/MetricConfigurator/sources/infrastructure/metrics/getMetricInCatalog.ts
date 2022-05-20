/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MetricCatalog, MetricTreeNodeUnion } from 'in-types';

interface MetricInCatalog {
  path: string[];
  label: string;
}

export default function getMetricInCatalog({
  metricCatalog,
  type,
  metric
}: {
  metricCatalog: MetricCatalog;
  type: string;
  metric: string;
}): MetricInCatalog | undefined {
  return metricCatalog.tree && find(metricCatalog.tree, type, metric, []);
}

function find(
  children: MetricTreeNodeUnion[],
  type: string,
  metric: string,
  path: string[]
): MetricInCatalog | undefined {
  for (var child of children) {
    switch (child.type) {
      case 'METRIC':
        if (child.parentType === type && child.name === metric) {
          return { path, label: child.label };
        } else {
          continue;
        }
      case 'LEVEL':
        var result = find(child.children, type, metric, [...path, child.label]);
        if (result) {
          return result;
        } else {
          continue;
        }
    }
  }
  return undefined;
}
