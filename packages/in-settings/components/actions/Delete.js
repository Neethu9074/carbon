import theme from 'in-themes';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Delete.mless';

export default function Delete({
  disabled,
  dialogMessage,
  entity,
  getEntityName,
  confirmLabel,
  doDelete,
  deleteEntity,
  setErrorMessage
}) {
  return (
    <SvgIcon
      type="lib_actions_delete"
      color={theme.lib.colors.primary2}
      className={evaluateClassNames({
        [locals.disabled]: disabled
      })}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        if (disabled) {
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
              bButtonLabel={confirmLabel || 'Remove'}
              onB={() => {
                close();
                doDelete(entity, deleteEntity, setErrorMessage);
              }}
              bButtonIcon="lib_actions_delete"
            />
          );
        }
      }}
    />
  );
}
