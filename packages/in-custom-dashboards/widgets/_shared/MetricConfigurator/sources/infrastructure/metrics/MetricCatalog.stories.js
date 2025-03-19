/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { range } from 'lodash';

import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import { plugins } from 'in-forge/constants';

export default {
  component: TypeAndMetricConfigurator
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

export const Default = props => {
  const [metric, setMetric] = useState();
  const [type, setType] = useState();
  const [query, onQueryChange] = useState('');

  const onChange = change => {
    setMetric(change.metric);
    setType(change.type);
  };
  const metricCatalogResult = metricCatalog(props['number of categories'], props['number of metrics']);
  return (
    <div>
      <TypeAndMetricConfigurator
        type={type}
        metric={metric}
        metricMetadata={{}}
        metricCatalog={metricCatalogResult.data}
        loading={metricCatalogResult.process.loading}
        errors={metricCatalogResult.errors}
        label="please select a metric"
        onChange={onChange}
        query={query}
        onQueryChange={onQueryChange}
      />
    </div>
  );
};
Default.args = {
  'number of categories': 20,
  'number of metrics': 20
};
Default.argTypes = {
  'number of categories': {
    control: {
      type: 'range',
      min: 1,
      max: 1000,
      step: 1
    }
  },
  'number of metrics': {
    control: {
      type: 'range',
      range: true,
      min: 1,
      max: 1000,
      step: 1
    }
  }
};
