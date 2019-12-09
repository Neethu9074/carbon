import React from 'react';

import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import AlertConfigDialog from 'in-websites/eum-alerting/AlertConfigDialog';
import Button from 'in-new-components/Button';

import locals from './AlertingConfigurationButton.mless';

export default function AlertingConfigurationButton({ alertConfig, websiteLabel }) {
  return (
    <Button
      className={locals.button}
      kind="secondary"
      onClick={() =>
        setActiveDialog(
          <AlertConfigDialog
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
