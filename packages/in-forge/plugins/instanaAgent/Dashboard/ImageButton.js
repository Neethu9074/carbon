import React from 'react';

import Button from 'in-new-components/Button';

export default function ImageButton({ children, iconType, iconSize, onClick }) {
  return (
    <Button icon={iconType} kind="secondary" onClick={onClick} iconSize={iconSize}>
      {children}
    </Button>
  );
}
