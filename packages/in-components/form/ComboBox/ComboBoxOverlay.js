import React from 'react';

import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { compareIgnoreCase } from 'in-services/util/string';
import { Ul } from 'in-new-components/lists/List/List';

export default function ComboBoxOverlay({options, value, onChange, close, disableAutomaticOptionSorting}) {
  if (!disableAutomaticOptionSorting) {
    options = options.sort(optionLabelComparator);
  }

  return (
    <Ul framed={false} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      {options.map((option, i) => (
        <OverlayOption
          onChange={onChange}
          key={option.value}
          autoFocus={(value == null && i === 0) || value === option.value}
          close={close}
          value={option.value}
          size="compact"
        >
          {option.label}
        </OverlayOption>
      ))}
    </Ul>
  );
}

function optionLabelComparator(a, b) {
  return compareIgnoreCase(a.label, b.label);
}
