import React from 'react';

import AddNewIntegrationDialog from 'in-views/configurationView/subview/AlertingConfiguration/components/AddNewIntegrationDialog';
import SelectedEntities from 'in-views/configurationView/subview/AlertingConfiguration/components/SelectedEntities';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { getIntegrations } from 'in-services/api/integrations';
import Step from 'in-components/form/Step';

import './Step3.less';

const block = 'in-alerting-config-form-step-3';

export default function Step2({ form, onChange }) {
  return (
    <Step number={3} title="Integrations" form={form} onChange={onChange}>
      <div className={`${block}__create-link`} onClick={addNewItem}>
        new integration...
      </div>
      <SelectedEntities
        form={form}
        onChange={onChange}
        getItems={getIntegrations}
        fieldName="kind"
        formFieldName="integrationIds"
      />
    </Step>
  );
}

function addNewItem() {
  setActiveDialog(<AddNewIntegrationDialog />);
}
