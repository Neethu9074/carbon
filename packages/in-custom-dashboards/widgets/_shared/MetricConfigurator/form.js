/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, createListForm, alwaysValidValidator } from 'formalistic';

import { just } from '@instana/observables';

import { potentialProblemsOnDatasetValidator } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsOnDatasetValidator';
import regexValidator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/regexValidator';
import { numberValidator, stringValidator, booleanValidator, objectValidator } from 'in-services/validators/jsonType';
import { validateThresholdOrder } from 'in-custom-dashboards/widgets/_shared/validator';
import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { minValidator, maxValidator } from 'in-services/validators/number';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { allFormatterIds } from 'in-stores/metric/formatters';
import { aggregationLabels } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

export function createForm(
  savedState,
  {
    // Adding new options? Remember to also make getConfigFromExistingForm aware of these
    withLabelConfiguration = false,
    withCompareToTimeShifted = false,
    withEnablePotentialProblems = false,
    withColorConfiguration = false,
    withMandatoryGrouping = false,
    withMetricFormatter = false,
    withEmptyValueFilter = false,
    withThresholdConfiguration = false
  } = {}
) {
  let form = createMapForm(
    withEnablePotentialProblems
      ? {
          validator: composeAndShortCircuitOnError(potentialProblemsOnDatasetValidator, regexValidator)
        }
      : {
          validator: regexValidator
        }
  )
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
    form = form
      .put(
        'label',
        createField({
          value: (savedState && savedState.label) || '',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
        })
      )
      .put(
        'metricLabel',
        createField({
          value: (savedState && savedState.metricLabel) || '',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
        })
      );
  }

  if (withMetricFormatter) {
    form = form
      .put(
        'formatter',
        createField({
          value: (savedState && savedState.formatter) || '',
          validator: composeAndShortCircuitOnError(
            notUndefinedValidator,
            stringValidator,
            notBlankValidator,
            buildEnumValidator(allFormatterIds)
          )
        })
      )
      .put(
        'formatterSelected',
        createField({
          value: savedState?.formatterSelected ?? undefined,
          validator: composeAndShortCircuitOnError(booleanValidator)
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

  if (withThresholdConfiguration) {
    form = form.put('threshold', createThresholdForm(savedState?.threshold));
  }

  const validator = withMandatoryGrouping ? validateMandatoryGrouping : null;

  if (savedState?.grouping?.length > 0) {
    const group = savedState?.grouping[0];
    const groupKey = group?.groupBys ? 'groupBys' : 'by';

    form = form.put(
      'grouping',
      createListForm({ validator: validator }).push(createGroupingForm({ groupKey, grouping: group ?? group.groupBys }))
    );
  } else {
    if (withMandatoryGrouping) {
      form = form.put('grouping', createListForm({ validator: validator }));
    }
  }

  if (form.get('source').valid) {
    form = sources[form.get('source').value].createForm(form, savedState);
  }

  if (withEmptyValueFilter) {
    form = form.put(
      'required',
      createField({
        value: (savedState && savedState.required) || false,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    );
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
  const isPotentialProblemValidator = form.validator === potentialProblemsOnDatasetValidator;
  const formatter = form.get('formatter');
  const withEmptyValueFilter = form.get('required');
  const thresholdConfiguration = form.get('threshold');

  return {
    withLabelConfiguration: !!labelField,
    withCompareToTimeShifted: !!compareToTimeShiftedField,
    withColorConfiguration: !!colorField,
    withEnablePotentialProblems: isPotentialProblemValidator,
    withMandatoryGrouping: isRequiringGroupingConfiguration(form),
    withMetricFormatter: !!formatter,
    withEmptyValueFilter: !!withEmptyValueFilter,
    withThresholdConfiguration: !!thresholdConfiguration
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

function createGroupItem(item) {
  return createMapForm()
    .put(
      'groupbyTag',
      createField({
        value: item?.groupbyTag ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'groupbyTagSecondLevelKey',
      createField({
        value: item?.groupbyTagSecondLevelKey ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator)
      })
    )
    .put(
      'groupbyTagEntity',
      createField({
        value: item?.groupbyTagEntity ?? 'NOT_APPLICABLE',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['NOT_APPLICABLE', 'DESTINATION', 'SOURCE'])
        )
      })
    )
    .put(
      'tagDefinition',
      createField({
        value: item?.tagDefinition,
        validator: composeAndShortCircuitOnError(objectValidator)
      })
    );
}

export function createGroupingForm({ groupKey = 'by', grouping }) {
  const isGroupBysKey = groupKey === 'groupBys';

  const createGroupItems = isGroupBysKey
    ? createListForm({
        items: grouping?.groupBys?.map(item => createGroupItem(item))
      })
    : createGroupItem(grouping?.by);

  return createMapForm()
    .put(groupKey, createGroupItems)
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
        value: grouping?.includeOthers ?? false,
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
          maxValidator(50)
        )
      })
    );
}

const createGroupingField = ({ form, validator, groupKey, newGrouping }) => {
  return form.put(
    'grouping',
    createListForm({ validator: validator })
      .push(createGroupingForm({ groupKey, grouping: newGrouping }))
      .setTouched(true, { recurse: true })
  );
};

export function onChangeGrouping(onChange, newGrouping, groupKey = 'by') {
  onChange([], form => {
    const validator = isRequiringGroupingConfiguration(form) ? validateMandatoryGrouping : null;
    const hasNoGroups = (!newGrouping?.by?.groupbyTag && !newGrouping?.groupBys) || newGrouping?.groupBys?.length === 0;

    if (hasNoGroups) {
      if (validator) {
        return form.put(
          'grouping',
          createListForm({ validator: form.get('grouping').validator }).setTouched(true, { recurse: true })
        );
      } else {
        return form.remove('grouping');
      }
    } else {
      return createGroupingField({
        form,
        validator,
        groupKey,
        newGrouping
      });
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

export function createThresholdForm(savedState) {
  return createMapForm({ validator: validateThresholdOrder })
    .put(
      'thresholdEnabled',
      createField({
        value: Boolean(savedState && savedState.thresholdEnabled),
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator)
      })
    )
    .put(
      'critical',
      createField({
        value: (savedState && savedState.critical) || '',
        validator: composeAndShortCircuitOnError(field => field.value === '')
      })
    )
    .put(
      'warning',
      createField({
        value: (savedState && savedState.warning) || '',
        validator: composeAndShortCircuitOnError(field => field.value === '')
      })
    )
    .put(
      'operator',
      createField({
        value: (savedState && savedState.operator) || '>='
      })
    );
}
