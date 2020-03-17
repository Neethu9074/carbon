import React from 'react';

import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
import Option from 'in-custom-dashboards/CustomDashboard/SharingDialog/Option';
import Actions from 'in-new-components/BigHeaderDialog/Actions';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';

import locals from './SharingDialogPresenter.mless';

export default function SharingDialogPresenter({ isPrivate, setPrivate, onSubmit }) {
  return (
    <BigHeaderDialog title="Share" titleIconType="lib_actions_share" onClose={close}>
      <form onSubmit={onSubmit}>
        <Option
          label="Private Dashboard"
          explanation="This dashboard will only be visible to you."
          checked={isPrivate}
          onChange={checked => setPrivate(checked)}
        />
        <Option
          label="Public Dashboard"
          explanation="This dashboard will be accessible to everyone in your organization. You will be able to manage editing rights."
          checked={!isPrivate}
          onChange={checked => setPrivate(!checked)}
        />

        <Actions>
          <Button kind="primary" type="submit" className={locals.button}>
            Done
          </Button>
        </Actions>
      </form>
    </BigHeaderDialog>
  );
}
