import React from 'react';

import FormDataEnrichment from 'in-views/configurationView/subview/DynamicRule/components/FormDataEnrichment';
import Step0 from 'in-views/configurationView/subview/DynamicRule/components/Step0';
import Step1 from 'in-views/configurationView/subview/DynamicRule/components/Step1';
import Step2 from 'in-views/configurationView/subview/DynamicRule/components/Step2';
import Step3 from 'in-views/configurationView/subview/DynamicRule/components/Step3';

export default function DynamicRuleForm({ form, onChange, excludeEntity, includeEntity }) {
  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} />
      <Step0 form={form} onChange={onChange} />
      <Step1 form={form} onChange={onChange} excludeEntity={excludeEntity} includeEntity={includeEntity} />
      <Step2 form={form} onChange={onChange} />
      <Step3 form={form} onChange={onChange} />
    </fieldset>
  );
}
