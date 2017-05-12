import React from 'react';

import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
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
            onB={() => {
              close();
              onDelete();
            }}
          />
        )}
    >
      Delete
    </Button>
  );
}
