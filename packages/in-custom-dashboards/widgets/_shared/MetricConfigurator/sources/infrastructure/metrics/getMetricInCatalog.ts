/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MetricCatalog, MetricTreeLevel, MetricTreeNodeUnion, MetricTreeMetric } from 'in-types';

interface Options {
  metricCatalog: MetricCatalog;
  type: string;
  metric: string;
}

interface MetricMetadata {
  path: string[];
  label: string;
}

export default function getMetricMetadata({ metricCatalog, type, metric }: Options): MetricMetadata | undefined {
  return metricCatalog.tree && find(metricCatalog.tree, type, metric, []);
}

function find(
  children: MetricTreeNodeUnion[] | MetricTreeLevel[],
  type: string,
  metric: string,
  path: string[]
): MetricMetadata | undefined {
  for (var child of children) {
    // before R221 type was overridden to return the parentType
    if (child.type === 'METRIC' || child.type === type) {
      const m = child as MetricTreeMetric;
      if ((m.parentType === type || m.type == type) && m.name === metric) {
        return { path, label: m.label };
      }
    } else if (child.type === 'LEVEL') {
      var l = child as MetricTreeLevel;
      var result = find(l.children, type, metric, [...path, l.label]);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
}
