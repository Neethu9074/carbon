import React from 'react';

import AlertChannelSwitch from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/AlertChannelSwitch';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { openAlertChannelSubmitFormTracker } from 'in-settings/tracker';
import { goToAlertChannelView } from 'in-settings/navigation/paths';
import Button from 'in-new-components/Button';
import Dialog from 'in-components/Dialog';

import locals from './NewChannelButton.mless';

export default function NewChannelButton() {
  return (
    <Button
      className={locals.createNewButton}
      kind="action"
      onClick={() => {
        setActiveDialog(<NewChannelDialog />);
        openAlertChannelSubmitFormTracker();
      }}
      icon="lib_openclose_add_circle_outline"
    >
      Add Alert Channel
    </Button>
  );
}

function NewChannelDialog() {
  return (
    <Dialog header="Choose Channel Type" onClose={close}>
      <AlertChannelSwitch
        onClick={type => {
          close();
          goToAlertChannelView(type);
        }}
      />
    </Dialog>
  );
}
