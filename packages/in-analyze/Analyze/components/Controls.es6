import React from 'react';

import Button from 'in-new-components/Button';

import locals from './Controls.mless';

export default function Controls({ filters, onResetClicked }) {
  const shouldShowResetButton = filters.get('tagFilter').size > 0 || filters.get('group');

  if (!shouldShowResetButton) {
    return null;
  }

  return (
    <div className={locals.controls}>
      <Button kind="secondary" size="compact" icon="lib_actions_revert" onClick={onResetClicked}>
        Reset
      </Button>
    </div>
  );
}
