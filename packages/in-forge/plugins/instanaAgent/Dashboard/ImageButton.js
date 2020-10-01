import React from 'react';

import Button from 'in-new-components/Button';

export default function ImageButton({ children, iconType, iconSize, onClick, disabled }) {
  return (
    <Button icon={iconType} kind="secondary" onClick={onClick} iconSize={iconSize} disabled={disabled}>
      {children}
    </Button>
  );
}
