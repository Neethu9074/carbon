import React, { useState } from 'react';

import StickySidebarContainer from 'in-new-components/layout/StickySidebarContainer';
import APConfigForm from 'in-custom-dashboards/widgets/Slo/APConfigForm';
import { DebugInfo } from 'in-custom-dashboards/widgets/Slo/DebugInfo';
import { getApplicationConfigsAsResultObservable } from './apiMock';
import { createForm } from 'in-custom-dashboards/widgets/Slo';

export default {
  title: 'Templates|CustomDashboard/widgets/slo/config/APConfigForm',
  component: APConfigForm
};

export function Default() {
  const [form, setForm] = useState(createForm());
  const onChange = (fieldName, value) => {
    setForm(form.updateIn([fieldName], field => field.setValue(value).setTouched(true)));
  };
  const mockApi = {
    getApplicationConfigsAsResultObservable
  };
  return (
    <StickySidebarContainer sidebar={<DebugInfo items={form.items} maxLevel={5} />}>
      <APConfigForm form={form} onChange={onChange} api={mockApi} />
    </StickySidebarContainer>
  );
}
