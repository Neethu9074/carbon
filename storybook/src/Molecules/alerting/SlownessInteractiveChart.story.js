import React, { useState } from 'react';

import SlownessInteractiveChart from 'in-applications/alerting/advanced/SlownessInteractiveChart';
import { createSmartAlertForm } from 'in-applications/alerting/form/smartAlertForm';
import { someSlownessFormData } from './formSampleData';

export default {
  title: 'Molecules|alerting/interactiveCharts/SlownessInteractiveChart',
  component: SlownessInteractiveChart
};

export function SlownessInteractiveChart_simple() {
  const [form, setForm] = useState(createSmartAlertForm(someSlownessFormData));

  let props = {
    form,
    onChange: (path, fn) => setForm(form.updateIn(path, fn)), // onChange
    updateForm: setForm
    // debounceOnChange$,
    // onChartConfigChange,
    // indexInitialSelectedTimeConfig
  };
  return <SlownessInteractiveChart {...props} />;
}
