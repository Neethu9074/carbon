import React from 'react';

import FormDataEnrichment from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/components/FormDataEnrichment';
import Step0 from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/components/Step0';
import Step2 from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/components/Step2';
import Step3 from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/components/Step3';

export default function AlertingConfigurationForm({ form, onChange, setForm }) {
  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} setForm={setForm} />
      <Step0 form={form} onChange={onChange} />
      <Step2 form={form} onChange={onChange} />
      <Step3 form={form} onChange={onChange} />
    </fieldset>
  );
}
