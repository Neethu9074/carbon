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
  setForm(
    createForm(
      { source: newSource, label: labelField ? labelField.value : null },
      { withLabelConfiguration: !!labelField }
    )
      .updateIn(['source'], field => field.setTouched(true))
      .updateIn(['label'], field => field.setTouched(true))
  );
}
