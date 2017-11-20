import React from 'react';

import SelectedEntities from 'in-views/configurationView/subview/AlertingConfiguration/components/SelectedEntities';
import { getHealthRules } from 'in-services/api/healthRules';
import Step from 'in-components/form/Step';

export default function Step2({ form, onChange }) {
  return (
    <Step number={2} title="Event Rules" form={form} onChange={onChange}>
      <SelectedEntities
        form={form}
        onChange={onChange}
        getItems={getHealthRules}
        fieldName="description"
        formFieldName="ruleIds"
      />
    </Step>
  );
}
