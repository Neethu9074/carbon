import React from 'react';

import ModificationSaveStatus from 'in-components/form/ModificationSaveStatus';
import Toggle from 'in-components/form/Toggle';

import './SavingToggle.less';

const block = 'in-table-saving-toggle';

export default function SavingToggle({ onChange, checked, status }) {
  return (
    <div className={`${block}__flex-wrapper`}>
      <Toggle className={`${block}__toggle`} checked={checked} onChange={e => onChange(e.target.checked)} />
      {status ? <ModificationSaveStatus status={status} className={`${block}__save-status`} reserveSpace /> : null}
    </div>
  );
}
