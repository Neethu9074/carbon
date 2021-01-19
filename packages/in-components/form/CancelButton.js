/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Button from 'in-new-components/Button';

export default function CancelButton({ children = 'Cancel', kind = 'subtle', onClick, isSaving, autoFocus }) {
  const disabled = isSaving;
  return (
    <Button kind={kind} onClick={disabled ? undefined : onClick} disabled={disabled} autoFocus={autoFocus}>
      {children}
    </Button>
  );
}
