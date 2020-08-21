import React, { useState } from 'react';

import {
  SloTarget,
  SliApConfigId,
  SloApName,
  TimeWindowType,
  SliConfigId
} from 'in-custom-dashboards/widgets/Slo/form';

import { getApplicationConfigsAsResultObservable, getSliConfigurations } from './apiMock';
import { Form, createForm } from 'in-custom-dashboards/widgets/Slo';
import { noop } from 'in-services/util/function';

export default {
  title: 'Templates|CustomDashboard/widgets/slo-config',
  component: Form
};
export function Default() {
  const api = {
    getSliConfigurations: getSliConfigurations,
    getApplicationConfigsAsResultObservable: getApplicationConfigsAsResultObservable
  };
  const widgetTitleFormGroup = <div>TitleForm placeholder</div>;

  const [form, setForm] = useState(
    createForm({
      [TimeWindowType]: 'fixed',
      [SloTarget]: 0.77
    })
  );
  const onChange = (path, fn) => {
    setForm(form.updateIn(path, fn));
  };

  return (
    <Form
      form={form}
      onChange={onChange}
      widgetTitleFormGroup={widgetTitleFormGroup}
      setSlideInView={noop}
      widgetPreview={<i>Widget Preview </i>}
      api={api}
    />
  );
}
