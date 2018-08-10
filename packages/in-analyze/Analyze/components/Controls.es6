import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Controls.mless';

export default function Controls({ filters, onResetClicked }) {
  const shouldShowResetButton = filters.get('tagFilter').size > 0 || filters.get('group');

  if (!shouldShowResetButton) {
    return null;
  }

  return (
    <div className={locals.resetButton} onClick={onResetClicked}>
      <SvgIcon className={locals.icon} type="lib_actions_revert" width={20} height={20} /> Reset
    </div>
  );
}
