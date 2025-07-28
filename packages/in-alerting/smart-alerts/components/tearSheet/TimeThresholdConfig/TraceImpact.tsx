/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, Field } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Stack } from '@instana/components';

//@ts-expect-error
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdViolationsInSequence.mless';

export default function TraceImpact({
  form,
  updateForm,
  isCustomInputStyle
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  isCustomInputStyle?: boolean;
}) {
  const timeThresholdForm = form.get('timeThreshold');
  const numberOfTracesImpacted = timeThresholdForm.get('requests')?.value;

  return (
    <Stack gap="xsmall">
      <AlertTypography
        variant={'body-small'}
        color={'color600'}
        content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfTracesImpacted')}
      />
      <DebouncedInput
        delay={300}
        id="traceImpact"
        name="requests"
        data-testid="traceImpactInput"
        type="number"
        min={1}
        value={numberOfTracesImpacted}
        onValueChange={(tracesImpacted: number) => {
          onChangeTraceImpact(tracesImpacted, form, updateForm);
        }}
        className={classNames({
          [locals.timeWindowInput]: isCustomInputStyle
        })}
      />
      <TouchedMessages field={timeThresholdForm.get('requests')} />
    </Stack>
  );
}

function onChangeTraceImpact(timeWindowValue: number, form: MapForm<any>, updateForm: (form: MapForm<any>) => void) {
  const timeThresholdForm = form.get('timeThreshold');

  let updatedForm = timeThresholdForm.updateIn(['requests'], (f: Field<number>) =>
    f.setValue(timeWindowValue).setTouched(true)
  );

  updateForm(form.put('timeThreshold', updatedForm));
}
