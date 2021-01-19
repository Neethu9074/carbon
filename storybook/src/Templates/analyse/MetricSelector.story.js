/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { withKnobs, boolean, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import MetricSelectorPresenter from 'in-analyze/components/MetricSelector/MetricSelectorPresenter';
import { availableMetrics, defaultMetrics } from 'in-websites/analyze/AnalyzeView/metrics';

export default {
  title: 'Templates|analyze/MetricSelector',
  component: MetricSelectorPresenter,
  decorators: [withKnobs]
};

export function Default() {
  const newMetricForm = createMapForm()
    .put(
      'metric',
      createField({
        value: text('Metric', 'beaconDuration'),
        validator: notBlankValidator
      })
    )
    .put(
      'aggregation',
      createField({
        value: text('Aggregation', 'P95'),
        validator: notBlankValidator
      })
    )
    .setTouched(boolean('Form Touched?', false), { recurse: true });

  const alwaysFail = boolean('Fail with too many metrics?', false);
  const selectedMetricsForm = createField({
    value: defaultMetrics.pageLoad,
    validator: () => {
      if (alwaysFail) {
        return [
          {
            severity: 'error',
            message: 'Too may metrics!'
          }
        ];
      }
      return null;
    }
  }).setTouched(boolean('Form Touched?', false), { recurse: true });

  return (
    <MetricSelectorPresenter
      title="Select Da Metrics"
      newMetricForm={newMetricForm}
      availableMetrics={availableMetrics.pageLoad}
      selectedMetricsForm={selectedMetricsForm}
      onMetricChange={action('onMetricChange')}
      onAggregationChange={action('onAggregationChange')}
      onRemoveMetric={action('onRemoveMetric')}
      onAddMetric={action('onAddMetric')}
      onSave={action('onSave')}
      onSwitchMetricPosition={action('onSwitchMetricPosition')}
    />
  );
}
