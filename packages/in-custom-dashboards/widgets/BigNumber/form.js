import { createMapForm, notBlankValidator, createField } from 'formalistic';

import { createForm as createMetricConfigurationForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { green, red } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { defaultFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';

export function createForm(savedState) {
  return createMapForm()
    .put(
      'formatter',
      createField({
        value: savedState?.formatter ?? defaultFormatter.id,
        validator: notBlankValidator
      })
    )
    .put(
      'comparisonDecreaseColor',
      createField({
        value: savedState?.comparisonDecreaseColor ?? green.id,
        validator: notBlankValidator
      })
    )
    .put(
      'comparisonIncreaseColor',
      createField({
        value: savedState?.comparisonIncreaseColor ?? red.id,
        validator: notBlankValidator
      })
    )
    .put('metricConfiguration', createMetricConfigurationForm(savedState && savedState.metricConfiguration));
}
