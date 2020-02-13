import { createMapForm, notBlankValidator, createField, createListForm } from 'formalistic';

import { createForm as createMetricConfigurationForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { defaultFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import { defaultRenderer } from 'in-custom-dashboards/widgets/Chart/renderer';
import { numericValidator } from 'in-services/validators/number';

export function createForm(savedState) {
  return createMapForm()
    .put(
      'type',
      createField({
        // Not configurable for some time
        value: 'TIME_SERIES',
        validator: notBlankValidator
      })
    )
    .put('y1', createAxisForm(savedState.y1, true))
    .put('y2', createAxisForm(savedState.y2));
}

function createAxisForm(savedState, requiresAtLeastOneMetric = false) {
  let metricsForm = createListForm({
    validator: requiresAtLeastOneMetric && atLeastOneMetricValidator
  });

  if (savedState && savedState.metrics) {
    savedState.metrics.forEach(metricSavedState => {
      metricsForm = metricsForm.push(createMetricForm(metricSavedState));
    });
  }

  return createMapForm()
    .put(
      'formatter',
      createField({
        value: (savedState && savedState.formatter) || defaultFormatter.id,
        validator: notBlankValidator
      })
    )
    .put(
      'renderer',
      createField({
        value: (savedState && savedState.renderer) || defaultRenderer.id,
        validator: notBlankValidator
      })
    )
    .put(
      'min',
      createField({
        value: getOptNumber(savedState && savedState.min),
        validator: numericValidator
      })
    )
    .put(
      'max',
      createField({
        value: getOptNumber(savedState && savedState.max),
        validator: numericValidator
      })
    )
    .put('metrics', metricsForm);
}

export function createMetricForm(savedState) {
  return createMetricConfigurationForm(savedState, { withLabelConfiguration: true });
}

function getOptNumber(v) {
  if (typeof v === 'number' && !isNaN(v)) {
    return v;
  }
  return undefined;
}

function atLeastOneMetricValidator(items) {
  if (items.length === 0) {
    return [
      {
        severity: 'error',
        message: 'At least one configured metric is required.'
      }
    ];
  }
}
