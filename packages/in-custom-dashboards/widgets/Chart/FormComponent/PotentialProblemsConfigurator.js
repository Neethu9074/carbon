/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';
import React from 'react';

import {
  addFieldsForPotentialProblems,
  removeFieldsForPotentialProblems,
  bluePrintForCallsMetric,
  ppFieldNames
} from 'in-custom-dashboards/widgets/Chart/FormComponent/potentialProblemsForm';
import { source as applicationSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { isPotentialProblemsSupportedByMetric } from 'in-applications/analyze/metrics';
import { getShortMetricKey } from 'in-custom-dashboards/widgets/Chart/util';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Select from 'in-components/form/Select/Select';
import Toggle from 'in-components/form/Toggle';
import { t } from 'in-i18n';

export default function PotentialProblemsConfigurator({ form, onChange }) {
  const potentialProblemsForm = form.get(ppFieldNames.potentialProblems);
  const potentialProblemsEnabled = Boolean(potentialProblemsForm);

  const potentialProblemsDatasetField = potentialProblemsForm?.get(ppFieldNames.dataset);
  const bluePrintForCallsMetricField = potentialProblemsForm?.get(ppFieldNames.bluePrintForCallsMetric);

  return (
    <Sections>
      <Section
        titleHtmlFor={`potential-problems-configurator`}
        title={t('in-custom-dashboards:widgets.formCompChart.potentialProblems.enabled')}
      >
        <HorizontalFlexWrapper>
          <Toggle
            id={`potential-problems-configurator`}
            checked={potentialProblemsEnabled}
            onChange={e => {
              onChange([], form => {
                if (e.target.checked) {
                  return addFieldsForPotentialProblems(form, {
                    potentialProblems: {}
                  })
                    .updateIn([ppFieldNames.potentialProblems, ppFieldNames.dataset], field => field.setTouched(true))
                    .setTouched(true);
                }
                return removeFieldsForPotentialProblems(form).setTouched(true);
              });
            }}
          />
          {t('in-custom-dashboards:widgets.formCompChart.potentialProblems.potentialProblemsDescription')}
        </HorizontalFlexWrapper>
      </Section>

      {potentialProblemsEnabled && (
        <SelectInSection
          label={t('in-custom-dashboards:widgets.formCompChart.potentialProblems.dataset')}
          id="metric-configurator-dataset-selector"
          value={potentialProblemsDatasetField.value}
          onChange={e =>
            onChange([ppFieldNames.potentialProblems, ppFieldNames.dataset], field =>
              field.setValue(e.target.value).setTouched(true)
            )
          }
          hasError={!potentialProblemsDatasetField.valid && potentialProblemsDatasetField.touched}
          additionalContent={<TouchedMessages field={potentialProblemsDatasetField} />}
          useAlternateBg
        >
          {
            <>
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
            </>
          }
        </SelectInSection>
      )}

      {potentialProblemsEnabled && showBluePrintSelector() && (
        <Section useAlternateBg>
          <Select
            id={`metric-configurator-blue-print-selector`}
            value={bluePrintForCallsMetricField.value}
            onChange={e =>
              onChange([ppFieldNames.potentialProblems, ppFieldNames.bluePrintForCallsMetric], field =>
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
