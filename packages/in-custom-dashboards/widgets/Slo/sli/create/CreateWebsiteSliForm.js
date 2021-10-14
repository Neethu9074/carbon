/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import useSliFormSideEffects from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSliFormSideEffects';
import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateSliForm';
import { WebsiteSliForm } from 'in-custom-dashboards/widgets/Slo/sli/WebsiteSliForm';
import { createForm } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import useWebsite from 'in-websites/hooks/useWebsite';

export default function CreateWebsiteSliForm({ entityId, close, sliConfig, setFooter }) {
  const { website, status } = useWebsite(entityId);

  if (status !== 'resolved' || sliConfig == null) {
    return <LoadingIndicator size="xl" />;
  }
  return (
    <CreateWebsiteSliFormComponent
      entityId={entityId}
      website={website}
      close={close}
      sliConfig={sliConfig}
      setFooter={setFooter}
    />
  );
}

function CreateWebsiteSliFormComponent({ entityId, website, sliConfig, close, setFooter }) {
  const { label } = website;

  const [form, setForm] = useState(createForm('website', sliConfig ?? {}, entityId, website));
  const updateForm = useSliFormSideEffects(form, setForm);

  return (
    <CreateSliForm form={form} updateForm={updateForm} setFooter={setFooter} editMode={!!sliConfig.id} close={close}>
      <WebsiteSliForm form={form} onChange={(path, fn) => updateForm(form.updateIn(path, fn))} websiteName={label} />
    </CreateSliForm>
  );
}
