/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, SpacerSizes, Spacer } from '@instana/components';

import {
  addFieldsForPotentialProblems,
  removeFieldsForPotentialProblems,
  bluePrintForCallsMetric,
  potentialProblemsCategory
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsForm';
import { isBluePrintForCallsSupportedByMetric } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsOnDatasetValidator';
import { isPotentialProblemsSupportedByMetric } from 'in-applications/analyze/metrics';
import ValidationBlock from 'in-components/form/ValidationBlock';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Select from 'in-components/form/Select/Select';
import Toggle from 'in-components/form/Toggle';
import { t } from 'in-i18n';

export default function PotentialProblemsConfigurator({ form, metricField, axisForm, grouping, onChange }) {
  const potentialProblemsField = form.get('potentialProblems');
  const potentialProblemsEnabled = Boolean(potentialProblemsField);

  const bluePrintForCallsMetricField = potentialProblemsField?.get('bluePrintForCallsMetric');

  /* PP can NOT be enabled, when
   * grouping is enabled,
   * for any unsupported metric
   */
  const notEnabled = grouping || !isPotentialProblemsSupportedByMetric(metricField?.value);

  const hasError = hasPotentialProblemsError(form) || hasPotentialProblemsError(axisForm);

  const metricHasMoreOptions = metricField?.value === 'calls';
  const invalidBlueprintSelected = isBluePrintForCallsSupportedByMetric(
    bluePrintForCallsMetricField,
    metricField?.value
  );

  return (
    <Sections>
      <Section
        hasError={hasError}
        titleHtmlFor="potential-problems-configurator"
        title={t('in-custom-dashboards:widgets.formCompChart.indexChart.potentialProblems')}
      >
        <Stack direction="horizontal" align="center" gap={SpacerSizes.normal}>
          <Toggle
            id="potential-problems-configurator"
            checked={potentialProblemsEnabled}
            disabled={notEnabled && !potentialProblemsEnabled}
            onChange={e => {
              onChange([], form => {
                if (e.target.checked) {
                  return addFieldsForPotentialProblems(form, {
                    potentialProblems: {}
                  });
                }
                return removeFieldsForPotentialProblems(form).setTouched(true);
              });
            }}
          />
          {t('in-custom-dashboards:widgets.formCompChart.potentialProblems.potentialProblemsDescription')}
          <Spacer horizontal={SpacerSizes.xsmall} />
          <Select
            disabled={(notEnabled || !potentialProblemsEnabled) && !metricHasMoreOptions && !invalidBlueprintSelected}
            id="metric-configurator-blue-print-selector"
            value={bluePrintForCallsMetricField?.value}
            onChange={e =>
              onChange(['potentialProblems', 'bluePrintForCallsMetric'], field =>
                field.setValue(e.target.value).setTouched(true)
              )
            }
            hasError={!bluePrintForCallsMetricField?.valid && bluePrintForCallsMetricField?.touched}
          >
            {Object.entries(bluePrintForCallsMetric).map(([bluePrint, userText]) => (
              <option key={bluePrint} value={bluePrint}>
                {userText}
              </option>
            ))}
          </Select>
        </Stack>
        {
          // validation on current dataset
          <ValidationMessages field={form} category={potentialProblemsCategory} />
        }
        {
          // validation on all metrics
          <ValidationMessages field={axisForm} category={potentialProblemsCategory} />
        }
      </Section>
    </Sections>
  );
}

function filterByCategory(category) {
  return message => !category || message?.category === category;
}

/**
 * Renders all validation error messages of a form of a specific category.
 * It does not show any path info of any message.
 *
 * @param field formalistic field
 * @param category only messages of this category are shown, or all if it is not defined
 * @returns {null|[ValidationBlock]}
 */
function ValidationMessages({ field, category }) {
  if (!field?.hierarchyTouched) {
    return null;
  }

  return field.messages.filter(filterByCategory(category)).map((message, i) => {
    return <ValidationBlock key={i}>{message.message}</ValidationBlock>;
  });
}

function hasPotentialProblemsError(form) {
  return !form?.valid && form?.messages?.filter(filterByCategory(potentialProblemsCategory)).length > 0;
}
