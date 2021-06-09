/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import Sections from 'in-new-components/workspace/Sections';
import Section from 'in-new-components/workspace/Section';
import Select from 'in-components/form/Select/Select';
import Toggle from 'in-components/form/Toggle';
import { t } from 'in-i18n';

export default function PotentialProblemsConfiguration({ form, onChange }) {
  const metricField = form.get('metric');
  const potentialProblemsField = form.get('potentialProblems');
  const bluePrintForCallsMetricField = form.get('bluePrintForCallsMetric');

  return (
    <Sections>
      <Section
        titleHtmlFor={`metic-configurator-potential-problems`}
        title={t('in-custom-dashboards:widgets.srcApp.formComponent.potentialProblems')}
      >
        <HorizontalFlexWrapper>
          <Toggle
            id={`metic-configurator-potential-problems`}
            checked={potentialProblemsField.value}
            onChange={e => {
              onChange(['potentialProblems'], field => field.setValue(e.target.checked).setTouched(true));
            }}
          />
          {t('in-custom-dashboards:widgets.srcApp.formComponent.potentialProblemsDescription')}
        </HorizontalFlexWrapper>
      </Section>

      {showBluePrintSelector() && (
        <Section useAlternateBg>
          <Select
            id={`metic-configurator-blue-print-selector`}
            value={bluePrintForCallsMetricField.value}
            onChange={e => {
              onChange(['bluePrintForCallsMetric'], field => field.setValue(e.target.value).setTouched(true));
            }}
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
    return potentialProblemsField.value && metricField.value === 'calls';
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
