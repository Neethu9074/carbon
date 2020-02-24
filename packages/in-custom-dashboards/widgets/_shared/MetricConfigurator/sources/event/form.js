import { createField, notBlankValidator } from 'formalistic';

export function createForm(form, savedState) {
  return form
    .put(
      'dynamicFocusQuery',
      createField({
        value: (savedState && savedState.dynamicFocusQuery) || ''
      })
    )
    .put(
      'metric',
      createField({
        // Metric selection not necessary because there is only one metric.
        // Therefore hard coded
        value: 'openEventCount',
        validator: notBlankValidator
      })
    )
    .put(
      'aggregation',
      createField({
        // Aggregation selection not necessary because there is only one metric.
        // Therefore hard coded
        value: 'DISTINCT_COUNT',
        validator: notBlankValidator
      })
    );
}
