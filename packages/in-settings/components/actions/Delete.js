/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { trackerEventDeleteTrigger } from 'in-settings/tracker';
import IconButton from 'in-components/IconButton/IconButton';
import { t, Trans } from 'in-i18n';

export default forwardRef(function Delete(
  { disabled, dialogMessage, entity, getEntityName, confirmLabel, doDelete, deleteEntity, setErrorMessage },
  ref
) {
  const validTypes = ['SCRIPT', 'HTTP', 'MANUAL'];
  return (
    <IconButton
      ref={ref}
      id={validTypes.includes(entity?.type) ? `delete_${entity.id}` : undefined}
      disabled={disabled}
      type="lib_actions_delete"
      kind="primaryv2"
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        if (entity?.type == 'CUSTOM') {
          trackerEventDeleteTrigger(entity);
        }
        addActiveDialog(
          <ConfirmationDialog
            header={t('in-settings:components.pleaseConfirm')}
            description={
              dialogMessage ? (
                dialogMessage(entity)
              ) : (
                <span>
                  <Trans
                    i18nKey="in-settings:components.confirmRemoveEntity"
                    values={{ entity: getEntityName(entity) }}
                  />
                </span>
              )
            }
            confirmButtonLabel={confirmLabel || t('in-settings:components.removeBtn')}
            onSubmit={() => {
              close();
              doDelete(entity, deleteEntity, setErrorMessage);
            }}
            confirmButtonAutoFocus
          />
        );
      }}
    />
  );
});
