/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { getMetricDefinition } from 'in-sdk/metrics/metrics';

import locals from './SubEntityInformation.mless';

export default function SubEntityInformation({ event }) {
  const metric = getFirstMetric(event);
  if (!metric) {
    return null;
  }

  const { metricPattern } = getMetricDefinition(metric.plugin, metric.metricName);
  if (!metricPattern) {
    // only show sub-entity information for metrics which have a metricPattern definition
    return null;
  }
  return (
    <div className={locals.container}>
      <span className={locals.label}>{`${metricPattern.placeholderLabel}:`}</span>
      <span className={locals.entity}>{matchPlaceholder(metricPattern.pattern, metric.metricName)}</span>
    </div>
  );
}

function getFirstMetric(event) {
  const fistEventMetric = event.getIn(['metadata', 'metrics', '0']);
  if (!fistEventMetric) {
    return null;
  }

  const metricName = fistEventMetric.get('metricName');
  const fullyQualifiedPlugin = fistEventMetric.getIn(['entityId', 'pluginId']);

  if (!metricName || !fullyQualifiedPlugin) {
    return null;
  }

  const plugin = translateFullyQualifiedPluginToShortPluginName(fullyQualifiedPlugin);
  return {
    plugin,
    metricName
  };
}

function matchPlaceholder(metricPattern, metricName) {
  const match = metricName.match(metricPattern);
  if (match && match.length > 1) {
    return match[1];
  }
}
