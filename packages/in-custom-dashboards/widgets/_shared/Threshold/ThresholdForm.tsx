/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Spacer, Stack, Toggle } from '@instana/components';
import { ThresholdOperator } from '@instana/types';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { metricConfigurationPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import ThresholdCondition from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdCondition';
import { getFormatter, getFormatterUnitConversion } from 'in-stores/metric/formatters';
import { decimalSeparator, thousandsSeparator } from 'in-services/formatters/number';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { thresholdCustomDashboardsEnabled } from 'in-services/featureFlags';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface ThresholdFormProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Field<string | boolean>) => Field<string | boolean>) => void;
}

export default function ThresholdForm({ form, onChange, updateForm }: ThresholdFormProps) {
  if (!thresholdCustomDashboardsEnabled) {
    return null;
  }

  const metricConfigForm = form.get(metricConfigurationPath);
  const thresholdForm = metricConfigForm.get('threshold');
  const thresholdOperator = thresholdForm.get('operator')?.value;
  const criticalField = thresholdForm.get('critical');
  const warningField = thresholdForm.get('warning');
  const isEnabled = !!thresholdForm.get('thresholdEnabled')?.value;
  const hasError = thresholdForm.messages.length > 0;

  const formatterValue = form.get('formatter')?.value;
  const formatter = getFormatter(formatterValue);

  const formattedCritical = criticalField?.value === '' ? '' : formatter(parseFloat(criticalField?.value));
  const formattedWarning = warningField?.value === '' ? '' : formatter(parseFloat(warningField?.value));

  // 1 represents the base value used to get the unit from
  const unit = getUnit(formatter(1));
  const hasUnitConversion = getFormatterUnitConversion(formatterValue);

  const displayConvertedUnitsCritical = shouldDisplayConvertedUnits(hasUnitConversion, formattedCritical);
  const displayConvertedUnitsWarning = shouldDisplayConvertedUnits(hasUnitConversion, formattedWarning);

  return (
    <Sections>
      <Section
        titleHtmlFor="metric-configurator-threshold-enabler"
        title={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.threshold')}
      >
        <Stack direction="horizontal" align="center" gap="disabled">
          <Toggle
            id="metric-configurator-threshold-enabler"
            checked={isEnabled}
            onToggle={e =>
              onChange(['metricConfiguration', 'threshold', 'thresholdEnabled'], field =>
                (field as Field<boolean>).setValue(e).setTouched(true)
              )
            }
          />
          <Spacer horizontal="xxsmall" />
          {t('in-custom-dashboards:widgets.bigNumber.thresholdForm.addThresholdColorization')}
        </Stack>
      </Section>

      {isEnabled && (
        <Section title="" useAlternateBg>
          <Sections>
            <ThresholdConditionFormGroup shouldIncreaseColumns hasWhiteBackground>
              <ThresholdOperatorDropDown
                form={metricConfigForm}
                allOptions
                updateForm={updateForm}
                customOnChange={newOperator =>
                  handleCustomOnChange({
                    form,
                    updateForm,
                    newOperator,
                    thresholdOperator,
                    criticalField,
                    warningField
                  })
                }
              />
            </ThresholdConditionFormGroup>
            <ThresholdCondition
              label={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.critical')}
              type="critical"
              onChange={onChange}
              displayConvertedUnits={displayConvertedUnitsCritical}
              formattedValue={formattedCritical}
              operator={thresholdOperator}
              hasError={hasError}
              field={criticalField}
              unit={unit}
            />
            <ThresholdCondition
              label={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.warning')}
              type="warning"
              onChange={onChange}
              displayConvertedUnits={displayConvertedUnitsWarning}
              formattedValue={formattedWarning}
              operator={thresholdOperator}
              hasError={hasError}
              field={warningField}
              unit={unit}
            />
          </Sections>
          <TouchedMessages field={thresholdForm} />
        </Section>
      )}
    </Sections>
  );
}

interface Props extends Omit<ThresholdFormProps, 'onChange'> {
  newOperator: string;
  thresholdOperator: ThresholdOperator;
  criticalField: Field<number>;
  warningField: Field<number>;
}

function handleCustomOnChange({
  form,
  thresholdOperator,
  newOperator,
  criticalField,
  warningField,
  updateForm
}: Props) {
  const isNewOperatorGreater = isGreaterOperator(newOperator);
  const isOperatorGreater = isGreaterOperator(thresholdOperator);
  const hasOperatorChanged = newOperator !== thresholdOperator;
  const hasOperatorDirectionChanged = isOperatorDirectionChanged(isOperatorGreater, isNewOperatorGreater);

  if (hasOperatorChanged && hasOperatorDirectionChanged) {
    updateForm(
      form
        // @ts-ignore-error
        .updateIn([metricConfigurationPath, 'threshold', 'warning'], f =>
          (f as Field<number | string>).setValue(criticalField?.value).setTouched(true)
        )
        // @ts-ignore-error
        .updateIn([metricConfigurationPath, 'threshold', 'critical'], f =>
          (f as unknown as Field<number | string>).setValue(warningField?.value).setTouched(true)
        )
        // @ts-ignore-error
        .updateIn([metricConfigurationPath, 'threshold', 'operator'], f =>
          (f as Field<string>).setValue(newOperator).setTouched(true)
        )
    );
  } else {
    updateForm(
      // @ts-ignore-error
      form.updateIn([metricConfigurationPath, 'threshold', 'operator'], f =>
        (f as Field<string>).setValue(newOperator).setTouched(true)
      )
    );
  }
}

function isGreaterOperator(operator: string) {
  return operator === '>=' || operator === '>';
}

function isOperatorDirectionChanged(isOperatorGreater: boolean, isNewOperatorGreater: boolean) {
  return isOperatorGreater !== isNewOperatorGreater || !isOperatorGreater !== !isNewOperatorGreater;
}

function getUnit(formattedValue: string | null | undefined): string {
  if (!formattedValue) {
    return '';
  }
  const valueSplitRegExp = new RegExp(`^(-?[0-9\\${decimalSeparator}\\${thousandsSeparator}]+)(.*)$`);
  const match = String(formattedValue).match(valueSplitRegExp);
  if (match) {
    return match[2].trim();
  }
  return '';
}

export function containsExactMatch(value: string) {
  const baseUnits = ['B', 'ms'];

  // Extract numeric and unit using regular expression
  const regex = new RegExp(`^(-?[0-9\\${decimalSeparator}\\${thousandsSeparator}]+)(.*)$`);
  const matches = value.trim().match(regex);

  if (!matches) {
    return false;
  }

  const numericPart = Number(matches[1].replace(/,/g, ''));
  const unitPart = matches[2].trim();

  // In case there is no unit, check if numeric part is valid
  if (!unitPart) {
    return !Number.isNaN(numericPart);
  }
  return baseUnits.includes(unitPart);
}

export function shouldDisplayConvertedUnits(hasUnitConversion: boolean, formattedValue?: string | null) {
  return formattedValue !== '' && !containsExactMatch(formattedValue ?? '') && hasUnitConversion;
}
