/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import APConfigForm from 'in-custom-dashboards/widgets/Slo/components/APConfigForm';
import { getApplicationConfigsAsResultObservable } from './apiMock';
import { apConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { createForm } from 'in-custom-dashboards/widgets/Slo';
import useObservable from 'in-hooks/useObservable';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO/config/APForm',
  component: APConfigForm
};

export function Default() {
  const [form, setForm] = useState(
    createForm({
      [apConfigId]: 'btg-B701Rx6o9QNXUS4TVw'
    })
  );
  const onUpdateApConfigId = newApConfigId => {
    setForm(form.updateIn([apConfigId], f => f.setValue(newApConfigId)));
    action('selected new apConfig')(newApConfigId);
  };

  const apConfigs = useObservable(getApplicationConfigObservable, []);
  return (
    <APConfigForm
      apConfigIdField={form.get(apConfigId)}
      apConfigs={apConfigs}
      onUpdateApConfigId={onUpdateApConfigId}
    />
  );
}

function getApplicationConfigObservable() {
  return getApplicationConfigsAsResultObservable().map(({ data }) => data);
}
