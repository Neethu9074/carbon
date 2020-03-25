import React from 'react';

import TemporaryMessage from 'in-new-components/TemporaryMessage';
import { getView } from 'in-stores/navigation';
import Button from 'in-new-components/Button';

import locals from './Footer.mless';

export default function Footer({ onSaveClick, parentPath, message }) {
  if (!message && !onSaveClick) {
    return null;
  }

  return (
    <div className={locals.footer}>
      {message && (
        <div className={locals.messageWrapper}>
          <TemporaryMessage {...message} duration={5000} />
        </div>
      )}
      <div className={locals.buttonLine}>
        {parentPath && (
          <Button kind="subtle" href$={getView(parentPath)}>
            Cancel
          </Button>
        )}
        {onSaveClick && <Button onClick={onSaveClick}>Save</Button>}
      </div>
    </div>
  );
}
