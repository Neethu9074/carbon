/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Ul } from '@instana/components';

import {
  and,
  or,
  openBracket,
  closeBracket,
  clear
} from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';
import { t } from 'in-i18n';

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
        <SvgIcon size="s" type="lib_openclose_cancel" /> {t('in-components:queryBuilder.selectorOverlayClear')}
      </OverlayOption>
      <OverlayOption
        autoFocus={value == null || value === and}
        onChange={onChange}
        close={close}
        selectedValue={value}
        value={and}
      >
        {t('in-components:queryBuilder.selectorOverlayAnd')}
      </OverlayOption>
      {!withoutOrConjunction && (
        <OverlayOption onChange={onChange} close={close} selectedValue={value} value={or}>
          {t('in-components:queryBuilder.selectorOverlayOr')}
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
