/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useRef } from 'react';
import { Field, MapForm } from 'formalistic';

import { Spacer, Stack, Toggle } from '@instana/components';

import ThresholdConditionFormGroup from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdConditionFormGroup';
import ThresholdOperatorDropDown from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdOperatorDropDown';
import ThresholdCondition from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdCondition';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import useFormField from 'in-custom-dashboards/widgets/_shared/useFormField';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { ThresholdOperator } from 'in-types';
import { t } from 'in-i18n';

interface ThresholdFormProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  formatter: string;
}

export default function ThresholdForm({ form, updateForm, formatter }: ThresholdFormProps) {
  const { form: isEnabledField, change: changeIsEnabledField } = useFormField<boolean>({
    form,
    path: ['thresholdEnabled'],
    updateForm
  });

  const { form: thresholdOperatorField, change: changeOperator } = useFormField<ThresholdOperator>({
    form,
    path: ['operator'],
    updateForm
  });
  const thresholdOperator = thresholdOperatorField?.value;
  const { form: criticalField, change: changeCriticalField } = useFormField<string>({
    form,
    path: ['critical'],
    updateForm
  });
  const { form: warningField, change: changeWarningField } = useFormField<string>({
    form,
    path: ['warning'],
    updateForm
  });

  const isEnabled = !!isEnabledField.value;
  const hasError = form.messages.length > 0;

  const previousOperator = useRef(thresholdOperator);
  useEffect(() => {
    if (thresholdOperator.charAt(0) !== previousOperator.current.charAt(0)) {
      // when operator direction is switched, field values also have to be switched
      updateForm(
        form
          // @ts-ignore-error
          .updateIn(['warning'], f => (f as Field<string>).setValue(criticalField?.value).setTouched(true))
          // @ts-ignore-error
          .updateIn(['critical'], f => (f as Field<stringr>).setValue(warningField?.value).setTouched(true))
      );
    }
    previousOperator.current = thresholdOperator;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdOperator]);

  return (
    <Sections>
      <Section
        titleHtmlFor="metric-configurator-threshold-enabler"
        title={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.threshold')}
      >
        <Stack direction="horizontal" align="center" gap="disabled">
          <Toggle id="metric-configurator-threshold-enabler" checked={isEnabled} onToggle={changeIsEnabledField} />
          <Spacer horizontal="xxsmall" />
          {t('in-custom-dashboards:widgets.bigNumber.thresholdForm.addThresholdColorization')}
        </Stack>
      </Section>

      {isEnabled && (
        <Section title="" useAlternateBg>
          <Sections>
            <ThresholdConditionFormGroup label={t('in-custom-dashboards:threshold.label')} hasWhiteBackground>
              <ThresholdOperatorDropDown field={thresholdOperatorField} onChange={changeOperator} />
            </ThresholdConditionFormGroup>
            <ThresholdCondition
              label={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.critical')}
              type="critical"
              change={changeCriticalField}
              operator={thresholdOperator}
              hasError={hasError}
              field={criticalField}
              formatterId={formatter}
            />
            <ThresholdCondition
              label={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.warning')}
              type="warning"
              change={changeWarningField}
              operator={thresholdOperator}
              hasError={hasError}
              field={warningField}
              formatterId={formatter}
            />
          </Sections>
          <TouchedMessages field={form} />
        </Section>
      )}
    </Sections>
  );
}
