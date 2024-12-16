/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { IconButton, SvgIcon, Button } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import Tooltip from 'in-components/Tooltip';
import { t, Trans } from 'in-i18n';

import locals from './Delete.mless';

interface DeleteProps {
  kind?: DeleteKind;
  tooltipContent?: string;
  dialogMessage: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  itemName: string;
  confirmLabel: string;
  doDelete: () => void;
  isDeleting: boolean;
  skipDialog?: boolean;
  disabled?: boolean;
  label?: string;
}

export enum DeleteKind {
  Icon = 'icon',
  Button = 'button'
}

export function Delete({
  confirmLabel,
  disabled = false,
  dialogMessage,
  doDelete,
  isDeleting,
  itemName,
  skipDialog = false,
  tooltipContent,
  kind = DeleteKind.Icon,
  label = t('in-settings:components.removeBtn')
}: DeleteProps) {
  const handleClick = () => {
    if (disabled) return;

    if (skipDialog) {
      return doDelete();
    }

    return addActiveDialog(
      <ConfirmationDialog
        header={t('in-settings:components.pleaseConfirm')}
        description={
          dialogMessage ? (
            dialogMessage
          ) : (
            <Trans i18nKey="in-settings:components.confirmRemoveItem" values={{ itemName }} />
          )
        }
        confirmButtonLabel={confirmLabel || t('in-settings:components.removeBtn')}
        onSubmit={() => {
          close();
          doDelete();
        }}
        confirmButtonAutoFocus
      />
    );
  };

  if (kind === DeleteKind.Button) {
    return (
      <Button data-testid="inline-editor-delete-button" kind="action" onClick={handleClick} disabled={isDeleting}>
        {label ? label : t('in-settings:components.removeBtn')}
      </Button>
    );
  } else {
    return (
      <>
        {tooltipContent ? (
          <Tooltip content={tooltipContent}>
            {isDeleting ? (
              <SvgIcon className={locals.loadingIcon} data-testid="loadingIcon" type="lib_actions_loading" spinning />
            ) : (
              <IconButton
                kind="primary"
                className={classNames({
                  [locals.icon]: true,
                  [locals.disabled]: disabled
                })}
                type="lib_actions_delete"
                data-testid="deleteIcon"
                onClick={handleClick}
              />
            )}
          </Tooltip>
        ) : (
          <>
            {isDeleting ? (
              <SvgIcon className={locals.loadingIcon} data-testid="loadingIcon" type="lib_actions_loading" spinning />
            ) : (
              <IconButton
                kind="primary"
                className={classNames({
                  [locals.icon]: true,
                  [locals.disabled]: disabled
                })}
                type="lib_actions_delete"
                data-testid="deleteIcon"
                onClick={e => {
                  stopPropagationAndPreventDefault(e);
                  handleClick();
                }}
              />
            )}
          </>
        )}
      </>
    );
  }
}
