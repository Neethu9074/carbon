import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { compareIgnoreCase } from 'in-services/util/string';
import { Ul } from 'in-new-components/lists/List/List';

import locals from './ComboBoxOverlay.mless';

export default function ComboBoxOverlay({
  options,
  value,
  onChange,
  asyncClose,
  disableAutomaticOptionSorting,
  listItemClassName
}) {
  if (!disableAutomaticOptionSorting) {
    options = options.sort(optionLabelComparator);
  }

  return (
    <Ul className={locals.list} framed={false} borderRadius="medium" onKeyDown={onKeyDown}>
      {options.map((option, i) => (
        <OverlayOption
          className={listItemClassName}
          onChange={onChange}
          key={i}
          autoFocus={(value == null && i === 0) || value === option.value}
          // Asynchronously close the overlay. If not for this, a keyboard event can trigger
          // both the closing and opening of the overlay at the same time thereby resulting in a noop.
          close={asyncClose}
          value={option.value}
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

function onKeyDown(e) {
  if (e.defaultPrevented) return;

  // Intercept Enter and Escape to prevent accidental closing of a dialog when used inside a dialog
  if ((e.key === 'Enter', e.key === 'Escape')) return stopPropagationAndPreventDefault(e);

  onArrowKeyDownFocusSiblings(e);
}
