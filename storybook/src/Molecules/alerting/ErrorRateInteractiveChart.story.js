import React, { useState } from 'react';

import ErrorRateInteractiveChart, {
  ThresholdCondition
} from 'in-applications/alerting/advanced/ErrorRateInteractiveChart';
import { createSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { someErrorRateFormData } from './formSampleData';
import { noop } from 'in-services/fixedObjects';

export default {
  title: 'Molecules/alerting/interactiveCharts/ErrorRateInteractiveChart',
  parameters: {
    // Error: Evaluation failed: TypeError: (void 0) is not a function
    chromatic: { disable: true }
  },
  component: ErrorRateInteractiveChart
};

export const thresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someErrorRateFormData()));

  const [tempThreshold, setTempThreshold] = useState(1);

  return (
    <ThresholdCondition
      {...{
        form,
        onChange: (path, fn) => setForm(form.updateIn(path, fn)),
        blueprintConfig: getBlueprintConfig('errorRate'),
        doDebounce: true,
        tempThreshold,
        setDoDebounce: noop,
        setTempThreshold,
        debounceOnChange$: noop
      }}
    />
  );
};
