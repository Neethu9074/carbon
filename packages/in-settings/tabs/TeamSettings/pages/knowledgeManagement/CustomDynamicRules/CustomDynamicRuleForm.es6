import React from 'react';

import FormDataEnrichment from 'in-settings/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/FormDataEnrichment';
import Step0 from 'in-settings/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/Step0';
import Step1 from 'in-settings/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/Step1';
import Step2 from 'in-settings/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/Step2';
import Step3 from 'in-settings/tabs/TeamSettings/pages/knowledgeManagement/CustomDynamicRules/components/Step3';

export default function DynamicRuleForm({ form, onChange, excludeEntity, includeEntity, isNewRuleDialog }) {
  return (
    <fieldset>
      <FormDataEnrichment form={form} onChange={onChange} />
      {isNewRuleDialog ? null : <Step0 form={form} onChange={onChange} />}
      <Step1 form={form} onChange={onChange} excludeEntity={excludeEntity} includeEntity={includeEntity} />
      <Step2 form={form} onChange={onChange} />
      <Step3 form={form} onChange={onChange} />
    </fieldset>
  );
}
