/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withKnobs, number } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import { range } from 'lodash';

import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import { plugins } from 'in-forge/constants';

export default {
  title: 'Molecules|Catalog/Metric',
  component: TypeAndMetricConfigurator,
  decorators: [withKnobs]
};

function metricCatalog(numberOfCategories, numberOfMetricsPerCategory) {
  const metrics = type =>
    range(0, numberOfMetricsPerCategory).map(i => ({
      label: `Metric number ${i} category`,
      children: [
        {
          label: `Metric number ${i}`,
          description: 'Lorem ipsum',
          icon: 'lib_views_tag',
          type: type,
          name: `metric_${i}`
        }
      ]
    }));
  const categories = range(0, numberOfCategories).map(i => {
    const type = Object.keys(plugins)[i % Object.keys(plugins).length];
    return {
      label: `Category ${i}`,
      description: null,
      icon: `plugin:${type}`,
      children: metrics(type)
    };
  });
  return {
    data: {
      tree: [
        {
          label: 'Infrastructure',
          description: null,
          icon: null,
          children: categories
        }
      ]
    },
    time: 1615336649501,
    adjustedWindowSize: null,
    errors: [],
    progress: { percentage: null, loading: false, note: null }
  };
}

export const Default = () => {
  const [metric, setMetric] = useState();
  const [type, setType] = useState();
  const [query, onQueryChange] = useState('');

  const onChange = change => {
    setMetric(change.metric);
    setType(change.type);
  };
  return (
    <div>
      <TypeAndMetricConfigurator
        type={type}
        metric={metric}
        metricCatalog={metricCatalog(
          number('number of categories', 20, {
            range: true,
            min: 1,
            max: 1000,
            step: 1
          }),
          number('number of metrics', 20, {
            range: true,
            min: 1,
            max: 1000,
            step: 1
          })
        )}
        label="please select a metric"
        onChange={onChange}
        query={query}
        onQueryChange={onQueryChange}
      />
    </div>
  );
};
