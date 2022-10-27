/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { getMetricDefinition } from 'in-sdk/metrics/metrics';

import locals from './SubEntityInformation.mless';

export default function SubEntityInformation({ event }) {
  const subEntities = extractSubEntitiesFromMetrics(event);

  if (subEntities.length === 0) {
    return null;
  }

  return (
    <>
      {subEntities.map(subEntity => (
        <div key={subEntity.value} className={locals.container}>
          <span className={locals.label}>{`${subEntity.label}:`}</span>
          <span className={locals.entity}>{subEntity.value}</span>
        </div>
      ))}
    </>
  );
}

function extractSubEntitiesFromMetrics(event) {
  const subEntities = [];

  event.getIn(['metadata', 'metrics']).forEach(metric => {
    const metricName = metric.get('metricName');
    const fullyQualifiedPlugin = metric.getIn(['entityId', 'pluginId']);

    if (!metricName || !fullyQualifiedPlugin) {
      return;
    }

    const plugin = translateFullyQualifiedPluginToShortPluginName(fullyQualifiedPlugin);

    const { metricPattern } = getMetricDefinition(plugin, metricName);
    const { placeholderLabel, pattern } = metricPattern ?? {};
    if (!metricPattern || !placeholderLabel || !pattern) {
      // only show sub-entity information for metrics which have a metricPattern definition with additional data
      return;
    }

    subEntities.push({
      label: placeholderLabel,
      value: matchPlaceholder(pattern, metricName)
    });
  });

  return subEntities;
}

function matchPlaceholder(metricPattern, metricName) {
  const match = metricName.match(metricPattern);
  if (match && match.length > 1) {
    return match[1];
  }
}
