/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';

import { stringValidator, booleanValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { t } from 'in-i18n';

export function createForm(form, savedState) {
  return form
    .put(
      'dynamicFocusQuery',
      createField({
        value: (savedState && savedState.dynamicFocusQuery) || '',
        validator: composeAndShortCircuitOnError(stringValidator)
      })
    )
    .put(
      'metric',
      createField({
        // Metric selection not necessary because there is only one metric.
        // Therefore hard coded
        value: 'eventCount',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['eventCount'])
        )
      })
    )
    .put(
      'metricLabel',
      createField({
        // Metric label not necessary because there is only one metric.
        // Therefore hard coded
        value: t('in-custom-dashboards:widgets.srcEvent.formComponent.eventCount'),
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        // Aggregation selection not necessary because there is only one metric.
        // Therefore hard coded
        value: 'DISTINCT_COUNT',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['DISTINCT_COUNT'])
        )
      })
    )
    .put(
      'includeK8sInfoEvents',
      createField({
        value: savedState?.includeK8sInfoEvents || false,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    )
    .put(
      'includeAgentMonitoringIssues',
      createField({
        value: savedState?.includeAgentMonitoringIssues || false,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    );
}
