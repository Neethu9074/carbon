import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import { createMapForm, createField, notBlankValidator } from 'formalistic';

export function createForm(savedState, { withLabelConfiguration = false } = {}) {
  let form = createMapForm()
    .put(
      'source',
      createField({
        value: (savedState && savedState.source) || '',
        validator: notBlankValidator
      })
    )
    .put(
      'metric',
      createField({
        value: (savedState && savedState.metric) || '',
        validator: notBlankValidator
      })
    )
    .put(
      'aggregation',
      createField({
        value: (savedState && savedState.aggregation) || '',
        validator: notBlankValidator
      })
    )
    .put(
      'timeShift',
      createField({
        value: (savedState && savedState.timeShift) || 0,
        validator: timeShiftValidator
      })
    );

  if (withLabelConfiguration) {
    form = form.put(
      'label',
      createField({
        value: (savedState && savedState.label) || '',
        validator: notBlankValidator
      })
    );
  }

  if (savedState && savedState.source) {
    form = sources[savedState.source].createForm(form, savedState);
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
  if (v == null || v === 'auto' || v === 0) {
    return null;
  }

  return [
    {
      message: 'Please select a time shifting configuration',
      severity: 'error'
    }
  ];
}
