/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { useState } from 'react';

// @ts-expect-error file needs to be converted to typescript
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import { someErrorRateFormData } from 'in-alerting/smart-alerts/applications/advanced/stories/formSampleData';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { noop } from 'in-services/util/function';
import { ThresholdType } from 'in-types';

export default {
  component: StaticOrAdaptiveSwitch
};

export const Default = ({ type, baselineEnabled }: { type: ThresholdType; baselineEnabled: boolean }) => {
  const defaultSmartAlertForm = createSmartAlertForm({
    ...someErrorRateFormData(),
    threshold: {
      type
    }
  });
  const blueprintConfig = {
    baselineEnabled
  };

  return <StaticOrAdaptiveSwitch form={defaultSmartAlertForm} setForm={noop} blueprintConfig={blueprintConfig} />;
};

Default.args = {
  baselineEnabled: false
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
    threshold: {
      type: ADAPTIVE_BASELINE
    }
  });
  const [form, setForm] = useState(() => smartAlertFormWithAdaptiveBaseline);
  const blueprintConfig = {
    baselineEnabled: false
  };

  return <StaticOrAdaptiveSwitch form={form} setForm={setForm} blueprintConfig={blueprintConfig} />;
};
