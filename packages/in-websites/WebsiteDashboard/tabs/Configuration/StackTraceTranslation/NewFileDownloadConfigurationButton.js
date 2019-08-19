import React from 'react';

import FileDownloadConfigurationDialog from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialog';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { addSourceMapConfiguration } from 'in-websites/api/websites';
import { reload } from 'in-settings/components/List';
import Button from 'in-new-components/Button';

import locals from './NewFileDownloadConfigurationButton.mless';

export default function InviteUserButton({ setMessage, websiteId }) {
  return (
    <Button
      className={locals.button}
      kind="action"
      onClick={() => {
        setActiveDialog(
          <FileDownloadConfigurationDialog onSubmit={config => onSubmit(config, setMessage, websiteId)} />
        );
      }}
      icon="lib_openclose_add_circle_outline"
    >
      Add Configuration
    </Button>
  );
}

function onSubmit(config, setMessage, websiteId) {
  close();
  setMessage({ message: 'Saving configuration…', type: 'success' });
  addSourceMapConfiguration(websiteId, config).once(
    () => {
      setMessage({ message: 'New configuration saved.', type: 'success' });
      reload();
    },
    error => {
      setMessage({ message: `Failed to save configuration: ${error.message}`, type: 'error' });
    }
  );
}
