import React from 'react';

import SimpleAlertDialog from 'in-websites/AlertConfigDialog/simple/SimpleAlertDialog';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';

import locals from './AlertingConfigurationButton.mless';
import Button from 'in-new-components/Button';

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
      View Alerting Configuration
    </Button>
  );
}
