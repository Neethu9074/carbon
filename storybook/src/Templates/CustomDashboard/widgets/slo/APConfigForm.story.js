import React, { useState } from 'react';

import APConfigForm from 'in-custom-dashboards/widgets/Slo/components/APConfigForm';
import { getApplicationConfigsAsResultObservable } from './apiMock';
import { createForm } from 'in-custom-dashboards/widgets/Slo';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO/config/APForm',
  component: APConfigForm
};

export function Default() {
  const [form, setForm] = useState(createForm());
  const onChange = (fieldPaths, fn) => {
    setForm(form.updateIn(fieldPaths, fn));
  };
  const apiMock = {
    getApplicationConfigsAsResultObservable
  };
  return <APConfigForm form={form} onChange={onChange} api={apiMock} />;
}
