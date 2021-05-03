/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';

import { sloTarget, timeWindowType, fixed } from 'in-custom-dashboards/widgets/Slo/form';
import { Form, createForm } from 'in-custom-dashboards/widgets/Slo';
import { noop } from 'in-services/util/function';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO/config',
  component: Form
};
export function Default() {
  const [form, setForm] = useState(
    createForm({
      [timeWindowType]: fixed,
      [sloTarget]: ''
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
      <Form form={form} onChange={onChange} setSlideInView={noop} />
    </>
  );
}
