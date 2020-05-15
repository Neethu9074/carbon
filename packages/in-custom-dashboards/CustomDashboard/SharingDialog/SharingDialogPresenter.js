import React from 'react';

import IndividualEditRightSelection from 'in-custom-dashboards/CustomDashboard/SharingDialog/IndividualEditRightSelection';
import BigHeaderDialog from 'in-new-components/BigHeaderDialog/BigHeaderDialog';
import Option from 'in-custom-dashboards/CustomDashboard/SharingDialog/Option';
import Actions from 'in-new-components/BigHeaderDialog/Actions';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';

import locals from './SharingDialogPresenter.mless';

export default function SharingDialogPresenter(props) {
  const { isPrivate, setPrivate, onSubmit } = props;

  return (
    <BigHeaderDialog title="Share" titleIconType="lib_actions_share" onClose={close} className={locals.dialog}>
      <form onSubmit={onSubmit}>
        <Option
          label="Private Dashboard (default)"
          explanation="This dashboard is only visible to you."
          checked={isPrivate}
          onChange={checked => setPrivate(checked)}
        />
        <Option
          label="Public Dashboard"
          explanation="This dashboard is visible to everyone in your organization. Only you are able to make changes, but you may add editors."
          checked={!isPrivate}
          onChange={checked => setPrivate(!checked)}
        />

        <IndividualEditRightSelection {...props} />

        <Actions>
          <Button kind="primary" type="submit" className={locals.button}>
            Done
          </Button>
        </Actions>
      </form>
    </BigHeaderDialog>
  );
}
