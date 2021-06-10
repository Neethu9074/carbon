/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';
import React from 'react';

import { source as applicationSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { isPotentialProblemsSupportedByMetric } from 'in-applications/analyze/metrics';
import { getShortMetricKey } from 'in-custom-dashboards/widgets/Chart/util';
import Sections from 'in-new-components/workspace/Sections';
import Section from 'in-new-components/workspace/Section';
import Select from 'in-components/form/Select/Select';
import Toggle from 'in-components/form/Toggle';
import { t } from 'in-i18n';

import locals from './PotentialProblemsConfigurator.mless';

export default function PotentialProblemsConfigurator({ form, onChange }) {
  const potentialProblemsForm = form.get('potentialProblems');
  const potentialProblemsEnabledField = potentialProblemsForm.get('enabled');
  const potentialProblemsDatasetField = potentialProblemsForm.get('dataset');
  const bluePrintForCallsMetricField = potentialProblemsForm.get('bluePrintForCallsMetric');

  return (
    <Sections>
      <Section
        titleHtmlFor={`potential-problems-configurator`}
        title={t('in-custom-dashboards:widgets.formCompChart.potentialProblems.enabled')}
      >
        <HorizontalFlexWrapper>
          <Toggle
            id={`potential-problems-configurator`}
            checked={potentialProblemsEnabledField.value}
            onChange={e => {
              onChange([], form => {
                return form
                  .updateIn(['potentialProblems', 'enabled'], field =>
                    field.setValue(e.target.checked).setTouched(true)
                  )
                  .updateIn(['potentialProblems', 'dataset'], field => field.setValue('').setTouched(true));
              });
            }}
          />
          {t('in-custom-dashboards:widgets.formCompChart.potentialProblems.potentialProblemsDescription')}
        </HorizontalFlexWrapper>
      </Section>

      {potentialProblemsEnabledField.value && (
        <Section useAlternateBg title={t('in-custom-dashboards:widgets.formCompChart.potentialProblems.dataset')}>
          <HorizontalFlexWrapper>
            <Select
              id={`metic-configurator-blue-print-selector`}
              value={potentialProblemsDatasetField.value}
              onChange={e =>
                onChange(['potentialProblems', 'dataset'], field => field.setValue(e.target.value).setTouched(true))
              }
              hasError={!potentialProblemsDatasetField.valid && potentialProblemsDatasetField.touched}
            >
              <option value="">
                {t('in-custom-dashboards:widgets.formCompChart.potentialProblems.selectDataSet')}
              </option>
              {getMetricsLabelForAxis('y1')
                .concat(getMetricsLabelForAxis('y2'))
                .map(({ key, label, disabled }) => (
                  <option key={key} value={key} disabled={disabled}>
                    {label}
                  </option>
                ))}
            </Select>

            {showBluePrintSelector() && (
              <Select
                className={locals.bluePrintSelector}
                id={`metic-configurator-blue-print-selector`}
                value={bluePrintForCallsMetricField.value}
                onChange={e =>
                  onChange(['potentialProblems', 'bluePrintForCallsMetric'], field =>
                    field.setValue(e.target.value).setTouched(true)
                  )
                }
                hasError={!bluePrintForCallsMetricField.valid && bluePrintForCallsMetricField.touched}
              >
                {Object.keys(bluePrintForCallsMetric).map(bluePrint => (
                  <option key={bluePrint} value={bluePrint}>
                    {bluePrintForCallsMetric[bluePrint]}
                  </option>
                ))}
              </Select>
            )}
          </HorizontalFlexWrapper>
        </Section>
      )}
    </Sections>
  );

  function showBluePrintSelector() {
    const dataset = potentialProblemsDatasetField.value;

    if (!isEmpty(dataset)) {
      const [axis, index] = dataset.toLowerCase().split('.');

      return form.getIn([axis, 'metrics', `${parseInt(index) - 1}`, 'metric'])?.value === 'calls';
    }

    return false;
  }

  function getMetricsLabelForAxis(axisName) {
    return form
      .getIn([axisName, 'metrics'])
      .toJS()
      .map((dataset, index) => {
        if (!isEmpty(dataset.source) && !isEmpty(dataset.metric) && !isEmpty(dataset.aggregation)) {
          const key = getShortMetricKey(axisName, index);
          const label = `${key} ${isEmpty(dataset.label) ? dataset.metricLabel : dataset.label}`;
          const disabled = !(
            dataset.source === applicationSource && isPotentialProblemsSupportedByMetric(dataset.metric)
          );

          return {
            key,
            label,
            disabled
          };
        }
      })
      .filter(Boolean);
  }
}

export const potentialProblemsCallsUnexpectedLowNumber = 'unexpectedLowNumberOfCalls';
export const potentialProblemsCallsUnexpectedHighNumber = 'unexpectedHighNumberOfCalls';
export const potentialProblemsCallsUnexpectedLowOrHighNumber = 'unexpectedLowOrHighNumberOfCalls';

export const bluePrintForCallsMetric = {
  [potentialProblemsCallsUnexpectedLowNumber]: t(
    'in-custom-dashboards:widgets.metricConfig.bluePrintForCallsMetric.unexpectedLowNumberOfCalls'
  ),
  [potentialProblemsCallsUnexpectedHighNumber]: t(
    'in-custom-dashboards:widgets.metricConfig.bluePrintForCallsMetric.unexpectedHighNumberOfCalls'
  ),
  [potentialProblemsCallsUnexpectedLowOrHighNumber]: t(
    'in-custom-dashboards:widgets.metricConfig.bluePrintForCallsMetric.unexpectedLowOrHighNumberOfCalls'
  )
};
