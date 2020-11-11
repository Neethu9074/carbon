import React from 'react';

import IndividualEditRightSelection from 'in-custom-dashboards/CustomDashboard/SharingDialog/IndividualEditRightSelection';
import Option from 'in-custom-dashboards/CustomDashboard/SharingDialog/Option';
import { close } from 'in-components/DialogPresenter/store';
import { neutral } from 'in-new-components/Message/types';
import Actions from 'in-new-components/Dialog/Actions';
import Dialog from 'in-new-components/Dialog/Dialog';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';

import locals from './SharingDialogPresenter.mless';

export default function SharingDialogPresenter(props) {
  const { isPrivate, setPrivate, onSubmit, isUsingAdvancedAccessRules } = props;

  return (
    <Dialog title="Share" titleIconType="lib_actions_share" onClose={close} className={locals.dialog}>
      <form onSubmit={onSubmit}>
        {isUsingAdvancedAccessRules && (
          <Message type={neutral} withIcon className={locals.message}>
            This custom dashboard has advanced access rules which cannot be represented by this dialog. You can use the{' '}
            {'"'}Edit As JSON{'"'} feature to edit these access rules.
          </Message>
        )}

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
    </Dialog>
  );
}
