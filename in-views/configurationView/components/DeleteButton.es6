import React from 'react';

import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import Button from 'in-components/Button';

export default function SavingToggle({ itemName, onDelete }) {
  return (
    <Button
      size="sm"
      kind="danger"
      onClick={() =>
        setActiveDialog(
          <ConfirmationDialog
            header="Confirm removal"
            description={
              <span>
                Are you sure you want to remove <strong>{itemName}</strong>?
              </span>
            }
            bButtonLabel="Remove"
            onB={onDelete}
          />
        )}
    >
      Delete
    </Button>
  );
}
