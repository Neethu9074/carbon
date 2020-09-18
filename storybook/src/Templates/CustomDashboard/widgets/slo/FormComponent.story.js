import React, { useState } from 'react';

import { SloTarget, TimeWindowType } from 'in-custom-dashboards/widgets/Slo/form';
import { Form, createForm } from 'in-custom-dashboards/widgets/Slo';
import { noop } from 'in-services/util/function';
import Button from 'in-new-components/Button';

export default {
  title: 'Templates/CustomDashboard/widgets/SLO/config',
  component: Form
};
export function Default() {
  const widgetTitleFormGroup = <div>TitleForm placeholder</div>;

  const [form, setForm] = useState(
    createForm({
      [TimeWindowType]: 'fixed',
      [SloTarget]: ''
    })
  );
  const onChange = (path, fn) => {
    setForm(form.updateIn(path, fn));
  };

  return (
    <>
      <p>Form valid? {form.hierarchyValid ? 'true' : 'false'}</p>
      <Button
        kind="primary"
        onClick={() => {
          setForm(form.setTouched(true, { recurse: true }));
        }}
      >
        trigger validation
      </Button>
      <Form
        form={form}
        onChange={onChange}
        widgetTitleFormGroup={widgetTitleFormGroup}
        setSlideInView={noop}
        widgetPreview={<i>Widget Preview </i>}
      />
    </>
  );
}
