/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Spacer, Stack, Toggle } from '@instana/components';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import ThresholdCondition from 'in-custom-dashboards/widgets/BigNumber/components/ThresholdCondition';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface ThresholdFormProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export default function ThresholdForm({ form, onChange, updateForm }: ThresholdFormProps) {
  const thresholdForm = form.get('threshold');
  const thresholdOperator = thresholdForm.get('operator').value;
  const isEnabled = Boolean(thresholdForm.get('thresholdEnabled')?.value);
  const humanReadableOperator = humanReadableThresholdOperator(thresholdOperator);
  const criticalField = thresholdForm.get('critical');
  const warningField = thresholdForm.get('warning');
  const unit = '';

  return (
    <Sections>
      <Section
        titleHtmlFor="metric-configurator-time-shift-enabler"
        title={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.threshold')}
      >
        <Stack direction="horizontal" align="center" gap="disabled">
          <Toggle
            id="metric-configurator-threshold-enabler"
            checked={isEnabled}
            onToggle={e =>
              onChange(['threshold', 'thresholdEnabled'], field =>
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
              <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
            </ThresholdConditionFormGroup>
            <ThresholdCondition
              label={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.critical')}
              type="critical"
              onChange={onChange}
              operator={humanReadableOperator}
              field={criticalField}
              unit={unit}
            />
            <ThresholdCondition
              label={t('in-custom-dashboards:widgets.bigNumber.thresholdForm.warning')}
              type="warning"
              onChange={onChange}
              operator={humanReadableOperator}
              field={warningField}
              unit={unit}
            />
          </Sections>
        </Section>
      )}
    </Sections>
  );
}
