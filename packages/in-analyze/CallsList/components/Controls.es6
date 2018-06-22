import React from 'react';

import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import Button from 'in-new-components/Button';

import locals from './Controls.mless';

export default function Controls({ filters, onResetClicked }) {
  const shouldShowResetButton =
    filters.get('tagFilter').size > 0 ||
    filters.getIn(['applicationFilter', APPLICATION.id]) ||
    filters.getIn(['applicationFilter', SERVICE.id]) ||
    filters.getIn(['applicationFilter', ENDPOINT.id]) ||
    filters.get('group');

  if (!shouldShowResetButton) {
    return null;
  }

  return (
    <div className={locals.controls}>
      <Button kind="subtle" size="compact" icon="lib_actions_revert" onClick={onResetClicked}>
        Reset
      </Button>
    </div>
  );
}
