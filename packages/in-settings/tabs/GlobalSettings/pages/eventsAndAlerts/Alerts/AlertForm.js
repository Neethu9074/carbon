/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import FormDataEnrichment from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/FormDataEnrichment';
import Step1 from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/Step1';
import Step2 from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/Step2';
import Step3 from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/Step3';
import Step4 from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/Step4';
import Step5 from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/Step5';

export default function AlertForm({ form, onChange, onChangeEventSelectionMode, onChangeApplyOn, setForm }) {
  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} setForm={setForm} />
      <Step1 form={form} onChange={onChange} />
      <Step2
        form={form}
        onChange={onChange}
        onChangeEventSelectionMode={onChangeEventSelectionMode}
        setForm={setForm}
      />
      <Step3
        key={form.get('eventSelectionMode')?.value}
        form={form}
        onChange={onChange}
        onChangeApplyOn={onChangeApplyOn}
        setForm={setForm}
      />
      <Step4 form={form} setForm={setForm} />
      <Step5 form={form} setForm={setForm} />
    </fieldset>
  );
}
