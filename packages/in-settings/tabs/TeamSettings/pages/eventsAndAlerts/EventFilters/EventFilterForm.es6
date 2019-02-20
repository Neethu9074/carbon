import React from 'react';

import FormDataEnrichment from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/components/FormDataEnrichment';
import Step0 from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/components/Step0';
import Step2 from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/components/Step2';
import Step3 from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/components/Step3';

export default function EventFilterForm({ form, onChange, onChangeApplyOn, setForm }) {
  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} setForm={setForm} />
      <Step0 form={form} onChange={onChange} />
      <Step2 form={form} onChange={onChange} onChangeApplyOn={onChangeApplyOn} setForm={setForm} />
      <Step3 form={form} onChange={onChange} />
    </fieldset>
  );
}
