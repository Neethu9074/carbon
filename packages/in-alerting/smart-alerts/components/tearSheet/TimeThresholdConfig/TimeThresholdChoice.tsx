/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { RadioButtonGroup, RadioButton } from '@instana/carbon';

//@ts-ignore
import { getTimeThresholdFormForType } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { timeThresholdTypesTearSheet } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { t } from 'in-i18n';

interface TimeThresholdChoiceProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  hasTraceImpactOption: boolean;
  hasUserImpactOption: boolean;
  impactTimeThresholdDisabled: boolean;
}
export default function TimeThresholdChoice({
  form,
  updateForm,
  hasTraceImpactOption,
  hasUserImpactOption,
  impactTimeThresholdDisabled
}: TimeThresholdChoiceProps) {
  const { violationsInSequence, violationsInPeriod, traceImpact, userImpactOfViolationsInSequence } =
    timeThresholdTypesTearSheet;
  const timeThresholdTypeSelected = form.get('timeThreshold').get('type').value ?? violationsInPeriod;

  return (
    <RadioButtonGroup
      onChange={timeThresholdType => {
        updateForm(form.put('timeThreshold', getTimeThresholdFormForType(form, timeThresholdType)));
      }}
      legendText={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAlert')}
      name="timeThresholdChoice"
      defaultSelected={timeThresholdTypeSelected}
      orientation="vertical"
    >
      <RadioButton
        labelText={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationsInSequenceLabel')}
        value={violationsInSequence}
        id={violationsInSequence}
      />
      <RadioButton
        labelText={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.violationsInPeriodLabel')}
        value={violationsInPeriod}
        id={violationsInPeriod}
      />
      {hasTraceImpactOption && !impactTimeThresholdDisabled && (
        <RadioButton
          labelText={t(
            'in-alerting:smartAlerts.components.tearSheet.timeThreshold.timeThresholdConfigTimeThresholdLabelTraceImpact'
          )}
          value={traceImpact}
          id={traceImpact}
        />
      )}
      {hasUserImpactOption && !impactTimeThresholdDisabled && (
        <RadioButton
          labelText={t(
            'in-alerting:smartAlerts.components.tearSheet.timeThreshold.labelUserImpactOfViolationsInSequence'
          )}
          value={userImpactOfViolationsInSequence}
          id={userImpactOfViolationsInSequence}
        />
      )}
    </RadioButtonGroup>
  );
}
