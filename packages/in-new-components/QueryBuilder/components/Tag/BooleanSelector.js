/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul } from 'in-new-components/lists/List/List';
import { compositeRef } from 'in-services/util/react';
import { t } from 'in-i18n';

import locals from './BooleanSelector.mless';

function Options({ value, onChange, close }) {
  return (
    <Ul framed={false} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      <OverlayOption
        onChange={value => {
          onChange(value);
        }}
        autoFocus={!value}
        close={close}
        value={'false'}
        size="compact"
      >
        {t('in-new-components:queryBuilder.components.tagBooleanSelectorFalse')}
      </OverlayOption>
      <OverlayOption onChange={onChange} autoFocus={value} close={close} value={'true'} size="compact">
        {t('in-new-components:queryBuilder.components.tagBooleanSelectorTrue')}
      </OverlayOption>
    </Ul>
  );
}

export default React.forwardRef(function BooleanSelector({ value, onChange, focus }, ref) {
  return (
    <Overlay
      withoutWrapper
      content={Options}
      props={{ value, onChange }}
      align="bottomMiddle"
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
          focus();
        }
      }}
    >
      {({ toggle, refSetter }) => (
        <div
          {...toInteractiveElement({
            onDefaultInteraction: () => toggle()
          })}
          className={locals.booleanValue}
          ref={compositeRef(refSetter, ref)}
        >
          {value
            ? t('in-new-components:queryBuilder.components.tagBooleanSelectorTrue')
            : t('in-new-components:queryBuilder.components.tagBooleanSelectorFalse')}
        </div>
      )}
    </Overlay>
  );
});
