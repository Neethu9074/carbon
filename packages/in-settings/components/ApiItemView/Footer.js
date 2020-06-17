import React from 'react';

import SaveCancelFooter from 'in-new-components/SaveCancelFooter/SaveCancelFooter';
import { getView } from 'in-stores/navigation';

import locals from './Footer.mless';

export default function Footer({ canSaveItem, onSaveClick, canDeleteItem, onDeleteClick, parentPath, form }) {
  if ((!canSaveItem && !canDeleteItem) || (!onSaveClick && !canDeleteItem)) {
    return null;
  }

  return (
    <SaveCancelFooter
      className={locals.footer}
      cancelHref$={parentPath ? getView(parentPath) : undefined}
      canSaveItem={canSaveItem}
      canDeleteItem={canDeleteItem}
      onSaveClick={onSaveClick}
      onDeleteClick={onDeleteClick}
      form={form}
      editMode
    />
  );
}
