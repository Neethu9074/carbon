import { createMapForm, notBlankValidator, createField } from 'formalistic';

import { createForm as createMetricConfigurationForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { defaultFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';

export function createForm(savedState) {
  return createMapForm()
    .put(
      'formatter',
      createField({
        value: (savedState && savedState.formatter) || defaultFormatter.id,
        validator: notBlankValidator
      })
    )
    .put('metricConfiguration', createMetricConfigurationForm(savedState && savedState.metricConfiguration));
}
