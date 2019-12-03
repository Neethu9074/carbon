import React from 'react';

import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

import locals from './CheckboxBarOverlay.mless';

export default function CheckboxOverlay({
  tag,
  existingSyntheticFilter,
  existingHiddenFilter,
  onChangeSynthetic,
  onChangeHidden
}) {
  return (
    <BarOverlay>
      <div className={locals.wrapper}>
        <CheckboxFancy
          label="Show Synthetic calls"
          checked={!!existingSyntheticFilter}
          onChange={() => onChangeSynthetic(tag.synthetic)}
          size="large"
        />
        <CheckboxFancy
          label="Show Internal calls"
          checked={!!existingHiddenFilter}
          onChange={() => onChangeHidden(tag.hidden)}
          size="large"
        />
      </div>
    </BarOverlay>
  );
}
