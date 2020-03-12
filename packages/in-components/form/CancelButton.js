import React from 'react';

import Button from 'in-new-components/Button';

export default function CancelButton({ children = 'Cancel', kind = 'subtle', onClick, isSaving }) {
  const disabled = isSaving;
  return (
    <Button kind={kind} onClick={disabled ? undefined : onClick} disabled={disabled}>
      {children}
    </Button>
  );
}
