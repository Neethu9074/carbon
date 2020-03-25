import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Delete.mless';

export default function Delete({ dialogMessage, itemName, confirmLabel, doDelete, isDeleting }) {
  if (isDeleting) {
    return <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning />;
  }

  return (
    <SvgIcon
      className={locals.icon}
      type="lib_actions_delete"
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        addActiveDialog(
          <ConfirmationDialog
            header="Please Confirm"
            description={
              dialogMessage ? (
                dialogMessage()
              ) : (
                <span>
                  Are you sure you want to remove <strong>{itemName}</strong>?
                </span>
              )
            }
            bButtonLabel={confirmLabel || 'Remove'}
            onB={() => {
              close();
              doDelete();
            }}
            bButtonIcon="lib_actions_delete"
          />
        );
      }}
    />
  );
}
