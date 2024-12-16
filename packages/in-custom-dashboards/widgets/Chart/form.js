/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createListForm, createMapForm } from 'formalistic';

import { combineLatest, just } from '@instana/observables';

import {
  createForm as createMetricConfigurationForm,
  migrate as migrateMetricConfiguration
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { validatePotentialProblemsConstraints } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsForm';
import { arrayValidator, booleanValidator, numberValidator, stringValidator } from 'in-services/validators/jsonType';
import { notDuplicatedMetricValues } from 'in-custom-dashboards/widgets/Table/infrastructure/validators/validator';
import { allRendererIds, defaultRenderer } from 'in-custom-dashboards/widgets/Chart/renderer';
import { allFormatterIds, defaultFormatter } from 'in-stores/metric/formatters';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { emptyArray, finishedProgress } from 'in-services/fixedObjects';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { merge } from 'in-services/util/resultMerger';
import { identity } from 'in-services/util/function';
import { t } from 'in-i18n';

export function createForm(savedState) {
  return createMapForm({
    validator: validatePotentialProblemsConstraints
  })
    .put(
      'type',
      createField({
        // Not configurable for some time
        value: 'TIME_SERIES',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['TIME_SERIES'])
        )
      })
    )
    .put('y1', createAxisForm(savedState && savedState.y1, true))
    .put('y2', createAxisForm(savedState && savedState.y2))
    .put(
      'shareMaxAxisDomain',
      createField({
        value: savedState?.shareMaxAxisDomain ?? false,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    );
}

export function createAxisForm(savedState, requiresAtLeastOneMetric = false, metricsMustBeUnique = false, options) {
  const withRenderer = options?.withRenderer ?? true;
  const withFormatter = options?.withFormatter ?? true;

  let metricsForm = createListForm({
    validator:
      (requiresAtLeastOneMetric && composeAndShortCircuitOnError(arrayValidator, atLeastOneMetricValidator)) ||
      (metricsMustBeUnique && composeAndShortCircuitOnError(notDuplicatedMetricValues))
  });

  if (savedState && savedState.metrics instanceof Array) {
    savedState.metrics.forEach(metricSavedState => {
      metricsForm = metricsForm.push(createMetricForm(metricSavedState, options));
    });
  }

  let form = createMapForm()
    .put(
      'formatterSelected',
      createField({
        value: savedState?.formatterSelected ?? undefined,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    )
    .put(
      'min',
      createField({
        value: getOptNumber(savedState && savedState.min),
        validator: numberValidator
      })
    )
    .put(
      'max',
      createField({
        value: getOptNumber(savedState && savedState.max),
        validator: numberValidator
      })
    )
    .put('metrics', metricsForm);

  if (withFormatter) {
    form = form.put(
      'formatter',
      createField({
        value: (savedState && savedState.formatter) || defaultFormatter.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(allFormatterIds)
        )
      })
    );
  }

  if (withRenderer) {
    form = form.put(
      'renderer',
      createField({
        value: (savedState && savedState.renderer) || defaultRenderer.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(allRendererIds)
        )
      })
    );
  }

  return form;
}

export function createMetricForm(
  savedState,
  options = {
    withLabelConfiguration: true,
    withCompareToTimeShifted: true,
    withEnablePotentialProblems: true,
    withColorConfiguration: true,
    withMetricFormatter: false,
    withThresholdConfiguration: true
  }
) {
  return createMetricConfigurationForm(savedState, options);
}

function getOptNumber(v) {
  if (typeof v === 'number' && !isNaN(v)) {
    return v;
  }
  return undefined;
}

function atLeastOneMetricValidator(items) {
  if (items.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.chart.atLeastOneDatasetIsRequired')
      }
    ];
  }
}

export function migrate(savedState) {
  const y1MigrationResult$ = migrateAxis(savedState.y1);
  const y2MigrationResult$ = migrateAxis(savedState.y2);

  return combineLatest([y1MigrationResult$, y2MigrationResult$])
    .map(results => merge(results, ([y1, y2]) => ({ y1, y2 })))
    .map(result => {
      if (!result.data) {
        return result;
      }

      return {
        ...result,
        data: {
          ...savedState,
          ...result.data
        }
      };
    });
}

function migrateAxis(axis) {
  if (!axis) {
    return just({
      progress: finishedProgress,
      errors: emptyArray,
      data: null
    });
  }

  const observables = axis.metrics.map(migrateMetricConfiguration);
  return combineLatest(observables)
    .map(results => merge(results, identity))
    .map(result => {
      if (!result.data) {
        return result;
      }

      return {
        ...result,
        data: {
          ...axis,
          metrics: result.data
        }
      };
    });
}
