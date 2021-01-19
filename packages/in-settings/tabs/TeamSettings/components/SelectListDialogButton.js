/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SelectListDialog from 'in-settings/tabs/TeamSettings/components/SelectListDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

import locals from './SelectListDialogButton.mless';

export default function SelectListDialogButton({
  onSubmit,
  title,
  label,
  listComponent,
  listComponentRightHeader,
  hiddenIds = [],
  limit,
  createSubmitLabel,
  requiresAtLeastOneMessage
}) {
  const disabled = hiddenIds.length >= limit;

  const button = (
    <Button
      className={locals.selectButton}
      kind="action"
      disabled={disabled}
      onClick={() =>
        addActiveDialog(
          <SelectListDialog
            title={title}
            listComponent={listComponent}
            listComponentRightHeader={listComponentRightHeader}
            hiddenIds={hiddenIds}
            limit={limit}
            onSubmit={onSubmit}
            createSubmitLabel={createSubmitLabel}
            requiresAtLeastOneMessage={requiresAtLeastOneMessage}
          />
        )
      }
      icon="lib_openclose_add_circle_outline"
    >
      {label}
    </Button>
  );

  if (disabled) {
    return <Tooltip content={`You can select at most ${limit} items.`}>{button}</Tooltip>;
  }
  return button;
}
