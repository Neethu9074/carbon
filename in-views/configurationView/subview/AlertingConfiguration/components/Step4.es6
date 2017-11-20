import React from 'react';

import AddNewIntegrationDialog from 'in-views/configurationView/subview/AlertingConfiguration/components/AddNewIntegrationDialog';
import SelectedEntities from 'in-views/configurationView/subview/AlertingConfiguration/components/SelectedEntities';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { getIntegrations } from 'in-services/api/integrations';
import Step from 'in-components/form/Step';

export default function Step2({ form, onChange }) {
  return (
    <Step number={4} title="Integrations" form={form} onChange={onChange}>
      <SelectedEntities
        form={form}
        onChange={onChange}
        getItems={getIntegrations}
        fieldName="kind"
        formFieldName="integrationIds"
        addNewItem={addNewItem}
      />
    </Step>
  );
}

function addNewItem() {
  setActiveDialog(<AddNewIntegrationDialog />);
}
