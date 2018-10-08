import React from 'react';

import Button from 'in-new-components/Button';

export default function ResetButton({ filters, onResetClicked }) {
  if (filters.get('tagFilter').size === 0) {
    return null;
  }

  return (
    <Button icon="lib_actions_cached" kind="subtle" size="compact" onClick={onResetClicked}>
      Clear filters
    </Button>
  );
}
