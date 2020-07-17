import { useState } from 'react';

import LogsInteractiveChart, { renderThresholdCondition } from 'in-applications/alerting/advanced/LogsInteractiveChart';
import { createSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { someLogsFormData } from './formSampleData';

export default {
  title: 'Molecules|alerting/interactiveCharts',
  component: LogsInteractiveChart
};

export const ThresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someLogsFormData()));

  const [tempThreshold, setTempThreshold] = useState(1);
  const noop = () => {};

  return renderThresholdCondition(
    form,
    (path, fn) => setForm(form.updateIn(path, fn)), //onChange,
    getBlueprintConfig('logs'),
    true, // doDebounce,
    tempThreshold,
    noop, //setDoDebounce,
    setTempThreshold,
    noop //debounceOnChange$
  );
};
