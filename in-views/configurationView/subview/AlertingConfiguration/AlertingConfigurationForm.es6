import React from 'react';

import FormDataEnrichment from 'in-views/configurationView/subview/AlertingConfiguration/components/FormDataEnrichment';
import Step0 from 'in-views/configurationView/subview/AlertingConfiguration/components/Step0';
// import Step1 from 'in-views/configurationView/subview/AlertingConfiguration/components/Step1';
import Step2 from 'in-views/configurationView/subview/AlertingConfiguration/components/Step2';
import Step3 from 'in-views/configurationView/subview/AlertingConfiguration/components/Step3';

export default function AlertingConfigurationForm({ form, onChange }) {
  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} />
      <Step0 form={form} onChange={onChange} />
      <Step2 form={form} onChange={onChange} />
      <Step3 form={form} onChange={onChange} />
    </fieldset>
  );
}
