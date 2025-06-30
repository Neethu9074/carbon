/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import FormFooter, { SaveButton, CancelButton, DeleteButton } from 'in-components/form/FormFooter/FormFooter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

import locals from './Footer.mless';

export default function Footer({
  canSaveItem,
  saveButtonVisible,
  saveLabel,
  isSaving,
  onSaveClick,
  canDeleteItem,
  onDeleteClick,
  onCancelClick,
  deleteLabel,
  parentPath,
  form
}) {
  const { createHrefToPath } = useNavigation();
  return (
    <FormFooter className={locals.footer}>
      {(parentPath || onCancelClick) && (
        <CancelButton href={parentPath ? createHrefToPath(parentPath) : undefined} onClick={onCancelClick} />
      )}
      {saveButtonVisible && (
        <SaveButton onClick={onSaveClick} disabled={!canSaveItem} form={form} isSaving={isSaving}>
          {saveLabel}
        </SaveButton>
      )}
      {onDeleteClick && <DeleteButton onClick={onDeleteClick} disabled={!canDeleteItem} label={deleteLabel} />}
    </FormFooter>
  );
}
