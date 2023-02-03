/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { useState } from 'react';

import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import { someErrorRateFormData } from 'in-alerting/smart-alerts/applications/dialog/advanced/stories/formSampleData';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { noop } from 'in-services/util/function';
import { ThresholdType } from 'in-types';

export default {
  component: StaticOrAdaptiveSwitch
};

export const Default = ({ type }: { type: ThresholdType }) => {
  const defaultSmartAlertForm = createSmartAlertForm({
    ...someErrorRateFormData(),
    // @ts-expect-error demo data are not fully matching expected type, but here it is okay
    threshold: {
      type
    } as const
  });

  return (
    <StaticOrAdaptiveSwitch form={defaultSmartAlertForm} setForm={noop} onThresholdTypeChange={onThresholdTypeChange} />
  );
};

Default.args = {
  type: STATIC_THRESHOLD
};

Default.argTypes = {
  type: {
    control: 'select',
    options: [ADAPTIVE_BASELINE, STATIC_THRESHOLD]
  }
};

export const Adaptive = () => {
  const smartAlertFormWithAdaptiveBaseline = createSmartAlertForm({
    ...someErrorRateFormData(),
    // @ts-expect-error demo data are not fully matching expected type, but here it is okay
    threshold: {
      type: ADAPTIVE_BASELINE
    } as const
  });
  const [form, setForm] = useState(() => smartAlertFormWithAdaptiveBaseline);

  return <StaticOrAdaptiveSwitch form={form} setForm={setForm} onThresholdTypeChange={onThresholdTypeChange} />;
};
