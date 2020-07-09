import PropTypes from 'prop-types';
import React from 'react';

import {
  and,
  or,
  not,
  openBracket,
  closeBracket,
  clear
} from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { Ul } from 'in-new-components/lists/List/List';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ConjunctionSelectorOverlay.mless';

export default function ConjunctionSelectorOverlay({ value, onChange, close }) {
  return (
    <Ul framed={false} className={locals.list} borderRadius="medium" onKeyDown={onKeyDown}>
      <OverlayOption
        autoFocus={value == null || value === and}
        onChange={onChange}
        close={close}
        selectedValue={value}
        value={and}
      >
        AND
      </OverlayOption>
      <OverlayOption onChange={onChange} close={close} selectedValue={value} value={or}>
        OR
      </OverlayOption>
      <OverlayOption onChange={onChange} close={close} selectedValue={value} value={not}>
        NOT
      </OverlayOption>
      <div className={locals.paranthesis}>
        <OverlayOption onChange={onChange} close={close} selectedValue={value} value={openBracket}>
          (
        </OverlayOption>
        <OverlayOption onChange={onChange} close={close} selectedValue={value} value={closeBracket}>
          )
        </OverlayOption>
      </div>
      <OverlayOption className={locals.clear} onChange={onChange} close={close} selectedValue={value} value={clear}>
        <SvgIcon size="s" type="lib_openclose_cancel" /> Clear
      </OverlayOption>
    </Ul>
  );
}

ConjunctionSelectorOverlay.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

export function onKeyDown(event) {
  const focusableElements = event.currentTarget.querySelectorAll('[tabindex]');
  // Note: We cannot call indexOf on focusableElements directly because
  // focusableElements is a NodeList that does not implement indexOf
  //
  // Note 2: [...focusableElements] does not manage to copy the elements properly.
  // Hence Array.prototype.slice.call is used…
  const currentIndex = Array.prototype.slice.call(focusableElements).indexOf(event.target);

  if (currentIndex < 0) {
    // None of the focusable elements are focused - do not try to change the
    // focus state.
    return;
  }

  // keyCode is deprecated and code is not yet supported everywhere
  const code = event.code ?? event.keyCode;
  let nextFocusIndex;
  if (code === keyCodes.arrows.up) {
    nextFocusIndex = currentIndex - 1;
  } else if (code === keyCodes.arrows.down) {
    nextFocusIndex = currentIndex + 1;
  }

  if (nextFocusIndex != null) {
    stopPropagationAndPreventDefault(event);
    nextFocusIndex = Math.max(0, Math.min(nextFocusIndex, focusableElements.length - 1));
    focusableElements[nextFocusIndex]?.focus();
  }
}
