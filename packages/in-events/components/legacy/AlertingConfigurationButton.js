import React from 'react';

import SimpleAlertDialog from 'in-websites/eum-alerting/simple/SimpleAlertDialog';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';

import locals from './AlertingConfigurationButton.mless';

export default function AlertingConfigurationButton({ alertConfig, websiteLabel }) {
  return (
    <Button
      className={locals.button}
      kind="secondary"
      onClick={() =>
        setActiveDialog(
          <SimpleAlertDialog
            onClose={() => {
              close();
            }}
            formData={alertConfig}
            websiteLabel={websiteLabel}
            editMode
          />
        )
      }
    >
      View/Edit Alerting Configuration
    </Button>
  );
}
