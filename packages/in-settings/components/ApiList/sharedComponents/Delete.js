import React from 'react';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-new-components/Dialog/ConfirmationDialog';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Delete.mless';

export default function Delete({ dialogMessage, itemName, confirmLabel, doDelete, isDeleting, skipDialog = false }) {
  if (isDeleting) {
    return <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning />;
  }

  return (
    <SvgIcon
      className={locals.icon}
      type="lib_actions_delete"
      onClick={() => {
        if (skipDialog) {
          return doDelete();
        }

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
            confirmButtonLabel={confirmLabel || 'Remove'}
            onSubmit={() => {
              close();
              doDelete();
            }}
          />
        );
      }}
    />
  );
}
