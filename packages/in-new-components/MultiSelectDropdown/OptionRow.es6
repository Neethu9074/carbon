import React from 'react';

import locals from './OptionRow.mless';

export default function OptionRow({ value, label, labelRenderer, checked, onChange }) {
  return (
    <div className={locals.row}>
      <label className={locals.label}>
        {labelRenderer ? labelRenderer(label) : label}
        <input
          type="checkbox"
          className={locals.checkbox}
          checked={checked}
          onChange={e => onChange(value, e.target.checked)}
        />
      </label>
    </div>
  );
}
