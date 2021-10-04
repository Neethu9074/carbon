/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import { getApplicationConfigsAsResultObservable } from 'in-custom-dashboards/widgets/Slo/stories/apiMock';
import ApplicationSelector from 'in-custom-dashboards/widgets/Slo/components/ApplicationSelector';
import { apConfigId } from 'in-custom-dashboards/widgets/Slo/form';
import { createForm } from 'in-custom-dashboards/widgets/Slo';

export default {
  component: ApplicationSelector
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

  return (
    <ApplicationSelector
      apConfigIdField={form.get(apConfigId)}
      getApConfigs={getApplicationConfigsAsResultObservable}
      onUpdateApConfigId={onUpdateApConfigId}
    />
  );
}
