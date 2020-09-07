import { createMapForm, notBlankValidator, createField } from 'formalistic';

import { createForm as createMetricConfigurationForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import * as allComparisonColors from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { green, red } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { defaultFormatter, allFormatterIds } from 'in-stores/metric/formatters';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { buildEnumValidator } from 'in-services/validators/enum';

const validComparisonColors = Object.values(allComparisonColors).map(c => c.id);

export function createForm(savedState) {
  return createMapForm()
    .put(
      'formatter',
      createField({
        value: savedState?.formatter ?? defaultFormatter.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          // Not blank validator is in here for a better UX when using
          // the visual dialog. The enum validator exists when editing
          // as JSON.
          notBlankValidator,
          buildEnumValidator(allFormatterIds)
        )
      })
    )
    .put(
      'comparisonDecreaseColor',
      createField({
        value: savedState?.comparisonDecreaseColor ?? green.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          // Not blank validator is in here for a better UX when using
          // the visual dialog. The enum validator exists when editing
          // as JSON.
          notBlankValidator,
          buildEnumValidator(validComparisonColors)
        )
      })
    )
    .put(
      'comparisonIncreaseColor',
      createField({
        value: savedState?.comparisonIncreaseColor ?? red.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          // Not blank validator is in here for a better UX when using
          // the visual dialog. The enum validator exists when editing
          // as JSON.
          notBlankValidator,
          buildEnumValidator(validComparisonColors)
        )
      })
    )
    .put('metricConfiguration', createMetricConfigurationForm(savedState && savedState.metricConfiguration));
}
