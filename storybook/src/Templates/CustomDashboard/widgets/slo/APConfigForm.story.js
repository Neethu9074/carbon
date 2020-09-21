import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import APConfigForm from 'in-custom-dashboards/widgets/Slo/components/APConfigForm';
import { getApplicationConfigsAsResultObservable } from './apiMock';
import { ApConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { createForm } from 'in-custom-dashboards/widgets/Slo';
import useObservable from 'in-hooks/useObservable';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO/config/APForm',
  component: APConfigForm
};

export function Default() {
  const [form, setForm] = useState(
    createForm({
      [ApConfigId]: 'btg-B701Rx6o9QNXUS4TVw'
    })
  );
  const onUpdateApConfigId = apConfigId => {
    setForm(form.updateIn([ApConfigId], f => f.setValue(apConfigId)));
    action('selected new apConfig')(apConfigId);
  };

  const apConfigs = useObservable(
    getApplicationConfigsAsResultObservable().map(({ data }) => data),
    []
  );

  return (
    <APConfigForm
      apConfigIdField={form.get(ApConfigId)}
      apConfigs={apConfigs}
      onUpdateApConfigId={onUpdateApConfigId}
    />
  );
}
