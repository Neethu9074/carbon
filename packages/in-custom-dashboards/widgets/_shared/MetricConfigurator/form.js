import { createMapForm, createField, notBlankValidator, createListForm } from 'formalistic';

import { numberValidator, stringValidator, objectValidator } from 'in-services/validators/jsonType';
import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { buildEnumValidator } from 'in-services/validators/enum';

export function createForm(savedState, { withLabelConfiguration = false } = {}) {
  let form = createMapForm()
    .put(
      'source',
      createField({
        value: (savedState && savedState.source) || '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(Object.keys(sources))
        )
      })
    )
    .put(
      'metric',
      createField({
        value: (savedState && savedState.metric) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        value: (savedState && savedState.aggregation) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'timeShift',
      createField({
        value: (savedState && savedState.timeShift) || 0,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, timeShiftValidator)
      })
    );

  if (withLabelConfiguration) {
    form = form.put(
      'label',
      createField({
        value: (savedState && savedState.label) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    );
  }

  if (savedState && savedState.grouping && savedState.grouping.length > 0) {
    form = form.put('grouping', createListForm().push(createSavedGroupingForm(savedState.grouping[0])));
  }

  if (form.get('source').valid) {
    form = sources[form.get('source').value].createForm(form, savedState);
  }

  return form;
}

export function onChangeSource(form, setForm, newSource) {
  const labelField = form.get('label');
  // We have to discard everything because the source is the first selection
  // option in the configuration dialog.
  let updatedForm = createForm(
    { source: newSource, label: labelField ? labelField.value : null, timeShift: form.get('timeShift').value },
    { withLabelConfiguration: !!labelField }
  )
    .updateIn(['source'], field => field.setTouched(true))
    .updateIn(['timeShift'], field => field.setTouched(form.get('timeShift').touched));

  if (labelField && labelField.touched) {
    updatedForm = updatedForm.updateIn(['label'], field => field.setTouched(true));
  }

  setForm(updatedForm);
}

function timeShiftValidator(v) {
  if (v == null || v === 'auto' || typeof v === 'number') {
    return null;
  }

  return [
    {
      message: 'Please select a time shifting configuration',
      severity: 'error'
    }
  ];
}

function createSavedGroupingForm(grouping) {
  return createMapForm()
    .put(
      'by',
      createField({
        value: grouping.by,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, objectValidator)
      })
    )
    .put(
      'direction',
      createField({
        value: grouping.direction,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'maxResults',
      createField({
        value: grouping.maxResults,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, numberValidator)
      })
    )
    .put(
      'metric',
      createField({
        value: grouping.metric,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        value: grouping.aggregation,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    );
}
