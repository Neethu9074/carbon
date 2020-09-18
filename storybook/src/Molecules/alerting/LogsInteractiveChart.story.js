import React, { useState } from 'react';

import LogsInteractiveChart, { ThresholdCondition } from 'in-applications/alerting/advanced/LogsInteractiveChart';
import { createSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { someLogsFormData } from './formSampleData';
import { noop } from 'in-services/fixedObjects';

export default {
  title: 'Molecules/alerting/interactiveCharts',
  component: LogsInteractiveChart
};

export const thresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someLogsFormData()));

  const [tempThreshold, setTempThreshold] = useState(1);

  return (
    <ThresholdCondition
      {...{
        form,
        onChange: (path, fn) => setForm(form.updateIn(path, fn)),
        blueprintConfig: getBlueprintConfig('logs'),
        doDebounce: true,
        tempThreshold,
        setDoDebounce: noop,
        setTempThreshold,
        debounceOnChange$: noop
      }}
    />
  );
};
