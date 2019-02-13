import React from 'react';

import IntegrationSwitch from 'in-settings/tabs/TeamSettings/pages/legacyAlerting/Integrations/components/IntegrationSwitch';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { goToIntegrationView } from 'in-settings/navigation/paths';
import Button from 'in-new-components/Button';
import Dialog from 'in-components/Dialog';

import locals from './NewIntegrationButton.mless';

export default function NewIntegrationButton() {
  return (
    <Button
      className={locals.createNewButton}
      kind="action"
      onClick={() => setActiveDialog(<NewIntegrationDialog />)}
      icon="lib_openclose_add_circle_outline"
    >
      Add Integration
    </Button>
  );
}

function NewIntegrationDialog() {
  return (
    <Dialog header="Choose Integration" onClose={close}>
      <IntegrationSwitch
        onClick={type => {
          close();
          goToIntegrationView(type);
        }}
      />
    </Dialog>
  );
}
