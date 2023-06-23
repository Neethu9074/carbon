/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button, SvgIcon } from '@instana/components';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import Tooltip from 'in-components/Tooltip';
import { t, Trans } from 'in-i18n';

import locals from './Delete.mless';

interface DeleteIconProps {
  onClick: () => void;
  disabled: boolean;
  isDeleting: boolean;
}

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
    if (!tooltipContent) return <DeleteIcon disabled={disabled} isDeleting={isDeleting} onClick={handleClick} />;

    return (
      <Tooltip content={tooltipContent}>
        <DeleteIcon disabled={disabled} isDeleting={isDeleting} onClick={handleClick} />
      </Tooltip>
    );
  }
}

export const DeleteIcon = React.forwardRef<SVGSVGElement, DeleteIconProps>((props, ref) => {
  const { disabled, isDeleting, onClick } = props;

  if (isDeleting)
    return (
      <SvgIcon className={locals.loadingIcon} data-testid="loadingIcon" type="lib_actions_loading" spinning ref={ref} />
    );

  return (
    <SvgIcon
      className={classNames({
        [locals.icon]: true,
        [locals.disabled]: disabled
      })}
      type="lib_actions_delete"
      data-testid="deleteIcon"
      onClick={onClick}
      ref={ref}
    />
  );
});

DeleteIcon.displayName = 'DeleteIcon';
