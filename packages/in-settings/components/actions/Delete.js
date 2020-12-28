import React, { forwardRef } from 'react';
import classNames from 'classnames';
import theme from 'in-themes';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-new-components/Dialog/ConfirmationDialog';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Delete.mless';

export default forwardRef(function Delete(
  { disabled, dialogMessage, entity, getEntityName, confirmLabel, doDelete, deleteEntity, setErrorMessage },
  ref
) {
  return (
    <SvgIcon
      ref={ref}
      type="lib_actions_delete"
      color={theme.lib.colors.primary2}
      className={classNames({
        [locals.disabled]: disabled
      })}
      onClick={
        disabled
          ? null
          : () => {
              if (disabled) {
                return;
              }
              addActiveDialog(
                <ConfirmationDialog
                  header="Please Confirm"
                  description={
                    dialogMessage ? (
                      dialogMessage(entity)
                    ) : (
                      <span>
                        Are you sure you want to remove the <strong>{getEntityName(entity)}</strong>?
                      </span>
                    )
                  }
                  confirmButtonLabel={confirmLabel || 'Remove'}
                  onSubmit={() => {
                    close();
                    doDelete(entity, deleteEntity, setErrorMessage);
                  }}
                />
              );
            }
      }
    />
  );
});
