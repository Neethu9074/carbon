import React from 'react';

import Button from 'in-new-components/Button';

export default function ResetButton({ filters, onResetClicked }) {
  const shouldShowResetButton = filters.get('tagFilter').size > 0 || filters.getIn(['group', 'name']) !== 'call.name';
  if (!shouldShowResetButton) {
    return null;
  }

  return (
    <Button icon="lib_actions_revert" kind="subtle" size="compact" onClick={onResetClicked}>
      Reset
    </Button>
  );
}
