import React from 'react';

import FormFooter, { SaveButton, CancelButton, DeleteButton } from 'in-components/form/FormFooter/FormFooter';
import { getView } from 'in-stores/navigation';

import locals from './Footer.mless';

export default function Footer({
  canSaveItem,
  saveButtonVisible,
  saveLabel,
  onSaveClick,
  canDeleteItem,
  onDeleteClick,
  onCancelClick,
  deleteLabel,
  parentPath,
  form
}) {
  return (
    <FormFooter className={locals.footer}>
      {(parentPath || onCancelClick) && (
        <CancelButton href$={parentPath ? getView(parentPath) : undefined} onClick={onCancelClick} />
      )}
      {saveButtonVisible && (
        <SaveButton onClick={onSaveClick} disabled={!canSaveItem} form={form}>
          {saveLabel}
        </SaveButton>
      )}
      {onDeleteClick && <DeleteButton onClick={onDeleteClick} disabled={!canDeleteItem} label={deleteLabel} />}
    </FormFooter>
  );
}
