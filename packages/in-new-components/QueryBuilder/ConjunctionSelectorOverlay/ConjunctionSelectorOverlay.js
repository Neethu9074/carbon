import PropTypes from 'prop-types';
import React from 'react';

import {
  and,
  or,
  openBracket,
  closeBracket,
  clear
} from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { Ul } from 'in-new-components/lists/List/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ConjunctionSelectorOverlay.mless';

export default function ConjunctionSelectorOverlay({
  value,
  onChange,
  close,
  withoutOrConjunction = false,
  withoutBrackets = false
}) {
  return (
    <Ul framed={false} className={locals.list} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      <OverlayOption className={locals.clear} onChange={onChange} close={close} selectedValue={value} value={clear}>
        <SvgIcon size="s" type="lib_openclose_cancel" /> Clear
      </OverlayOption>
      <OverlayOption
        autoFocus={value == null || value === and}
        onChange={onChange}
        close={close}
        selectedValue={value}
        value={and}
      >
        AND
      </OverlayOption>
      {!withoutOrConjunction && (
        <OverlayOption onChange={onChange} close={close} selectedValue={value} value={or}>
          OR
        </OverlayOption>
      )}
      {!withoutBrackets && (
        <div className={locals.paranthesis}>
          <OverlayOption onChange={onChange} close={close} selectedValue={value} value={openBracket}>
            (
          </OverlayOption>
          <OverlayOption onChange={onChange} close={close} selectedValue={value} value={closeBracket}>
            )
          </OverlayOption>
        </div>
      )}
    </Ul>
  );
}

ConjunctionSelectorOverlay.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  withoutOrConjunction: PropTypes.bool,
  withoutBrackets: PropTypes.bool
};
