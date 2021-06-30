/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, Spacer, Toggle } from '@instana/components';

import {
  addFieldsForPotentialProblems,
  removeFieldsForPotentialProblems,
  bluePrintForCallsMetric,
  potentialProblemsCategory
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsForm';
import { isPotentialProblemsSupportedByMetric } from 'in-applications/analyze/metrics';
import ValidationBlock from 'in-components/form/ValidationBlock';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Select from 'in-components/form/Select/Select';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function PotentialProblemsConfigurator({ form, metricField, axisForm, grouping, onChange }) {
  const potentialProblemsField = form.get('potentialProblems');
  const potentialProblemsEnabled = Boolean(potentialProblemsField);

  const bluePrintForCallsMetricField = potentialProblemsField?.get('bluePrintForCallsMetric');
  const moreThanOneDataset = axisForm.get('y1').get('metrics').size + axisForm.get('y2').get('metrics').size > 1;
  const metricValue = metricField?.value;
  const unsupportedMetric = !isPotentialProblemsSupportedByMetric(metricValue);

  const timeShiftField = form.get('timeShift');
  const timeshift = timeShiftField.value !== 0;

  const disabled = timeshift || grouping || unsupportedMetric || moreThanOneDataset;
  const hasError = hasPotentialProblemsError(form) || hasPotentialProblemsError(axisForm);
  const metricHasMoreOptions = metricValue === 'calls';

  return (
    <Sections>
      <Section
        hasError={hasError}
        titleHtmlFor="potential-problems-configurator"
        title={t('in-custom-dashboards:widgets.formCompChart.indexChart.potentialProblems')}
      >
        <Stack direction="horizontal" align="center" distribution="start" gap="disabled">
          <Tooltip content={tooltipMessage(timeshift, grouping, moreThanOneDataset, unsupportedMetric)} align="topLeft">
            <span>
              <Toggle
                id="potential-problems-configurator"
                checked={potentialProblemsEnabled}
                disabled={disabled && !potentialProblemsEnabled}
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
            </span>
          </Tooltip>

          <Spacer horizontal="xxsmall" />

          {t('in-custom-dashboards:widgets.formCompChart.potentialProblems.potentialProblemsDescription.anyMetric')}
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

      {metricHasMoreOptions && (
        <Section useAlternateBg>
          <Select
            disabled={disabled || !potentialProblemsEnabled}
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
        </Section>
      )}
    </Sections>
  );
}

function tooltipMessage(timeshift, grouping, moreThanOneDataset, unsupportedMetric) {
  if (timeshift) {
    return t('in-custom-dashboards:widgets.formCompChart.potentialProblems.tooltip.needToTurnOffTimeShift');
  }
  if (grouping) {
    return t('in-custom-dashboards:widgets.formCompChart.potentialProblems.tooltip.needToTurnOffGrouping');
  }
  if (moreThanOneDataset) {
    return t('in-custom-dashboards:widgets.formCompChart.potentialProblems.tooltip.needToRemoveDatasets');
  }
  if (unsupportedMetric) {
    return t('in-custom-dashboards:widgets.formCompChart.potentialProblems.tooltip.needToChangeMetric');
  }
  return '';
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
