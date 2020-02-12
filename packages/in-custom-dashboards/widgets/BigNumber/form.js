import { createMapForm } from 'formalistic';

import { createForm as createMetricConfigurationForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';

export function createForm() {
  return createMapForm().put('metricConfiguration', createMetricConfigurationForm());
}
