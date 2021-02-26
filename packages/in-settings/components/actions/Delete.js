/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import theme from 'in-themes';
import { t, Trans } from 'in-i18n';

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
                />
              );
            }
      }
    />
  );
});
