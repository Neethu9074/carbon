import { useState } from 'react';

import ErrorRateInteractiveChart, {
  renderThresholdCondition,
  renderThresholdConditionNew
} from 'in-applications/alerting/advanced/ErrorRateInteractiveChart';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { createSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';
import { someErrorRateFormData } from './formSampleData';

export default {
  title: 'Molecules|alerting/interactiveCharts/ErrorRateInteractiveChart',
  component: ErrorRateInteractiveChart
};

export const ThresholdConditionOldDesign = () => {
  const [form, setForm] = useState(createSmartAlertForm(someErrorRateFormData()));

  const [tempThreshold, setTempThreshold] = useState(1);
  const noop = () => {};

  return renderThresholdCondition(
    form,
    (path, fn) => setForm(form.updateIn(path, fn)), // onChange
    getBlueprintConfig('errorRate'),
    true, // doDebounce,
    tempThreshold,
    noop, //setDoDebounce,
    setTempThreshold,
    noop //debounceOnChange$
  );
};
export const ThresholdCondition = () => {
  const [form, setForm] = useState(createSmartAlertForm(someErrorRateFormData()));

  const [tempThreshold, setTempThreshold] = useState(1);
  const noop = () => {};

  return renderThresholdConditionNew(
    form,
    (path, fn) => setForm(form.updateIn(path, fn)), // onChange
    getBlueprintConfig('errorRate'),
    true, // doDebounce,
    tempThreshold,
    noop, //setDoDebounce,
    setTempThreshold,
    noop //debounceOnChange$
  );
};
