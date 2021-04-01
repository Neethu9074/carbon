/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, notBlankValidator, createListForm, alwaysValidValidator } from 'formalistic';
import { just } from '@instana/observables';

import { numberValidator, stringValidator, booleanValidator } from 'in-services/validators/jsonType';
import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { minValidator, maxValidator } from 'in-services/validators/number';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import { buildEnumValidator } from 'in-services/validators/enum';
import { aggregationLabels } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

export function createForm(
  savedState,
  {
    // Adding new options? Remember to also make getConfigFromExistingForm aware of these
    withLabelConfiguration = false,
    withCompareToTimeShifted = false,
    withColorConfiguration = false,
    withMandatoryGrouping = false
  } = {}
) {
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
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(Object.keys(aggregationLabels))
        )
      })
    )
    .put(
      'timeShift',
      createField({
        value: (savedState && savedState.timeShift) || 0,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, timeShiftValidator)
      })
    );

  if (withCompareToTimeShifted) {
    form = form.put(
      'compareToTimeShifted',
      createField({
        value: Boolean(savedState && savedState.compareToTimeShifted),
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator)
      })
    );
  }

  if (withLabelConfiguration) {
    form = form.put(
      'label',
      createField({
        value: (savedState && savedState.label) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
      })
    );
  }

  if (withColorConfiguration) {
    form = form.put(
      'color',
      createField({
        value: (savedState && savedState.color) || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
      })
    );
  }

  const validator = withMandatoryGrouping ? validateMandatoryGrouping : null;

  if (savedState?.grouping?.length > 0) {
    form = form.put(
      'grouping',
      createListForm({ validator: validator }).push(createGroupingForm(savedState.grouping[0]))
    );
  } else {
    if (withMandatoryGrouping) {
      form = form.put('grouping', createListForm({ validator: validator }));
    }
  }

  if (form.get('source').valid) {
    form = sources[form.get('source').value].createForm(form, savedState);
  }

  return form;
}

export function onChangeSource(form, setForm, newSource) {
  const labelField = form.get('label');
  const compareToTimeShiftedField = form.get('compareToTimeShifted');
  // We have to discard everything because the source is the first selection
  // option in the configuration dialog.
  let updatedForm = createForm(
    {
      source: newSource,
      label: labelField?.value,
      timeShift: form.get('timeShift').value,
      compareToTimeShifted: compareToTimeShiftedField?.value
    },
    getConfigFromExistingForm(form)
  )
    .updateIn(['source'], field => field.setTouched(true))
    .updateIn(['timeShift'], field => field.setTouched(form.get('timeShift').touched));

  if (labelField && labelField.touched) {
    updatedForm = updatedForm.updateIn(['label'], field => field.setTouched(true));
  }

  setForm(updatedForm);
}

function getConfigFromExistingForm(form) {
  const labelField = form.get('label');
  const compareToTimeShiftedField = form.get('compareToTimeShifted');
  const colorField = form.get('color');
  return {
    withLabelConfiguration: !!labelField,
    withCompareToTimeShifted: !!compareToTimeShiftedField,
    withColorConfiguration: !!colorField,
    withMandatoryGrouping: isRequiringGroupingConfiguration(form)
  };
}

export function isRequiringGroupingConfiguration(form) {
  return Boolean(form.get('grouping')?.validator && form.get('grouping').validator !== alwaysValidValidator);
}

export function duplicate(form) {
  const state = form.toJS();
  state.label = `Duplicate of ${getMetricLabel(state)}`;
  return createForm(state, getConfigFromExistingForm(form));
}

function timeShiftValidator(v) {
  if (v == null || v === 'auto' || typeof v === 'number') {
    return null;
  }

  return [
    {
      message: t('in-custom-dashboards:widgets.metricConfigurator.pleaseSelectATimeShiftingConfiguration'),
      severity: 'error'
    }
  ];
}

function validateMandatoryGrouping(form) {
  if (form.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.metricConfigurator.pleaseProvideAGroup')
      }
    ];
  }
}

export function createGroupingForm(grouping) {
  return createMapForm()
    .put(
      'by',
      createMapForm()
        .put(
          'groupbyTag',
          createField({
            value: grouping?.by?.groupbyTag ?? '',
            validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
          })
        )
        .put(
          'groupbyTagSecondLevelKey',
          createField({
            value: grouping?.by?.groupbyTagSecondLevelKey ?? '',
            validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
          })
        )
        .put(
          'groupbyTagEntity',
          createField({
            value: grouping?.by?.groupbyTagEntity ?? 'NOT_APPLICABLE',
            validator: composeAndShortCircuitOnError(
              notUndefinedValidator,
              stringValidator,
              notBlankValidator,
              buildEnumValidator(['NOT_APPLICABLE', 'DESTINATION', 'SOURCE'])
            )
          })
        )
    )
    .put(
      'direction',
      createField({
        value: grouping?.direction ?? 'DESC',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['ASC', 'DESC'])
        )
      })
    )
    .put(
      'includeOthers',
      createField({
        value: grouping?.includeOthers ?? true,
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator)
      })
    )
    .put(
      'maxResults',
      createField({
        value: grouping?.maxResults ?? 5,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          numberValidator,
          minValidator(1),
          maxValidator(20)
        )
      })
    );
}

export function onChangeGrouping(onChange, newGrouping) {
  onChange([], form => {
    const validator = isRequiringGroupingConfiguration(form) ? validateMandatoryGrouping : null;
    if (!newGrouping?.by?.groupbyTag) {
      if (validator) {
        return form.put(
          'grouping',
          createListForm({ validator: form.get('grouping').validator }).setTouched(true, { recurse: true })
        );
      } else {
        return form.remove('grouping');
      }
    } else {
      return form.put(
        'grouping',
        createListForm({ validator: validator })
          .push(createGroupingForm(newGrouping))
          .setTouched(true, { recurse: true })
      );
    }
  });
}

export function migrate(savedState) {
  return (
    sources[savedState.source]?.migrate?.(savedState) ||
    just({
      data: savedState,
      progress: finishedProgress,
      errors: emptyArray
    })
  );
}
