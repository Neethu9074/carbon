/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import useSliFormSideEffects from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSliFormSideEffects';
import { ApplicationSliForm } from 'in-custom-dashboards/widgets/Slo/sli/ApplicationSliForm';
import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateSliForm';
import { createForm } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import useApplication from 'in-applications/hooks/useApplication';

export default function CreateApplicationSliForm({ entityId, close, sliConfig, setFooter }) {
  const { application, status } = useApplication(entityId);

  if (status !== 'resolved' || sliConfig == null) {
    return <LoadingIndicator size="xl" />;
  }
  return (
    <CreateApplicationSliFormComponent
      entityId={entityId}
      application={application}
      close={close}
      sliConfig={sliConfig}
      setFooter={setFooter}
    />
  );
}

function CreateApplicationSliFormComponent({ entityId, application, close, sliConfig, setFooter }) {
  const { label } = application;

  const [form, setForm] = useState(createForm('application', sliConfig ?? {}, entityId, application));
  const updateForm = useSliFormSideEffects(form, setForm);

  return (
    <CreateSliForm form={form} updateForm={updateForm} setFooter={setFooter} editMode={!!sliConfig?.id} close={close}>
      <ApplicationSliForm form={form} onChange={(path, fn) => updateForm(form.updateIn(path, fn))} apName={label} />
    </CreateSliForm>
  );
}
