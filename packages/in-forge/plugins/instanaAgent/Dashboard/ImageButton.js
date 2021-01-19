/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';

import Button from 'in-new-components/Button';

export default forwardRef(function ImageButton({ children, iconType, iconSize, onClick, disabled }, ref) {
  return (
    <Button icon={iconType} kind="secondary" onClick={onClick} iconSize={iconSize} disabled={disabled} ref={ref}>
      {children}
    </Button>
  );
});
