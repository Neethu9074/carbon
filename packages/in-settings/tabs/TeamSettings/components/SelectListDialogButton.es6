import React from 'react';

import SelectListDialog from 'in-settings/tabs/TeamSettings/components/SelectListDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';

import locals from './SelectListDialogButton.mless';

export default function SelectListDialogButton({
  onSubmit,
  title,
  label,
  listComponent,
  listComponentRightHeader,
  selectedItems,
  createSubmitLabel,
  requiresAtLeastOneMessage
}) {
  return (
    <Button
      className={locals.selectButton}
      kind="action"
      onClick={() =>
        setActiveDialog(
          <SelectListDialog
            title={title}
            listComponent={listComponent}
            listComponentRightHeader={listComponentRightHeader}
            selectedItems={selectedItems}
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
}
