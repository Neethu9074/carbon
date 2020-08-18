import React, { useState } from 'react';

import APConfigForm from 'in-custom-dashboards/widgets/Slo/APConfigForm';
import { createForm } from 'in-custom-dashboards/widgets/Slo';

export default {
  title: 'Templates|CustomDashboard/widgets/slo/APConfigForm',
  component: APConfigForm
};

export function Default() {
  const [form, setForm] = useState(createForm());
  const onChange = (fieldPaths, fn) => {
    setForm(form.updateIn(fieldPaths, fn));
  };
  return <APConfigForm form={form} onChange={onChange} />;
}
