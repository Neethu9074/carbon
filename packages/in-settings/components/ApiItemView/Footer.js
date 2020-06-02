import React from 'react';

import SaveCancelFooter from 'in-new-components/SaveCancelFooter/SaveCancelFooter';
import { getView } from 'in-stores/navigation';

import locals from './Footer.mless';

export default function Footer({ canSaveItem, saveItem, parentPath, onSaveClick, form }) {
  if (!canSaveItem || !saveItem) {
    return null;
  }

  return (
    <SaveCancelFooter
      className={locals.footer}
      cancelHref$={parentPath ? getView(parentPath) : undefined}
      onSaveClick={onSaveClick}
      form={form}
      editMode
    />
  );
}
