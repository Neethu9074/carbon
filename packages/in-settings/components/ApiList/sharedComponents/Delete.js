/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';

import locals from './Delete.mless';

export default function Delete({
  dialogMessage,
  itemName,
  confirmLabel,
  doDelete,
  isDeleting,
  skipDialog = false,
  disabled = false
}) {
  if (isDeleting) {
    return <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning />;
  }

  return (
    <SvgIcon
      className={classNames({
        [locals.icon]: true,
        [locals.disabled]: disabled
      })}
      type="lib_actions_delete"
      onClick={
        !disabled &&
        (() => {
          if (skipDialog) {
            return doDelete();
          }

          addActiveDialog(
            <ConfirmationDialog
              header={t('in-settings:components.pleaseConfirm')}
              description={
                dialogMessage ? (
                  dialogMessage()
                ) : (
                  <span>
                    <Trans i18nKey="in-settings:components.confirmRemoveItem" values={{ itemName: itemName }} />
                  </span>
                )
              }
              confirmButtonLabel={confirmLabel || t('in-settings:components.removeBtn')}
              onSubmit={() => {
                close();
                doDelete();
              }}
            />
          );
        })
      }
    />
  );
}
