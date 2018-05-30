import React from 'react';

import locals from './OptionRow.mless';

export default function OptionRow({ value, label, labelRenderer, checked, onChange }) {
  return (
    <div>
      <div className={locals.label}>{labelRenderer ? labelRenderer(label) : label}</div>
      <input type="checkbox" checked={checked} onChange={e => onChange(value, e.target.checked)} />
    </div>
  );
}
