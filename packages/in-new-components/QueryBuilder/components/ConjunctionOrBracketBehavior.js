/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  and,
  or,
  not,
  openBracket,
  closeBracket,
  clear
} from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import ConjunctionSelectorOverlay from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/ConjunctionSelectorOverlay';
import { OPEN_BRACKET, CLOSE_BRACKET, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/formModel';
import { withInteractivitySideEffects } from 'in-new-components/interactiveCustomElement';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';
import Overlay from 'in-new-components/overlays/Overlay';

export default function ConjunctionOrBracketBehavior({
  element: { renderModelIndex, formModelIndex },
  onRemove,
  onChange: onChangeInFormModel,
  focus,
  'aria-label': arialLabel,
  value,
  children,
  withoutOrConjunction = false,
  withoutBrackets = false
}) {
  return (
    <Overlay
      withoutWrapper
      content={ConjunctionSelectorOverlay}
      props={{ value, onChange, withoutOrConjunction, withoutBrackets }}
      align="bottomMiddle"
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
          focus(renderModelIndex);
        }
      }}
    >
      {overlayProps => {
        const interactivitySideEffectProps = withInteractivitySideEffects({
          onDefaultInteraction: overlayProps.toggle,
          preventDefault: true,
          stopPropagation: true
        });

        return children({
          ...overlayProps,
          elementProps: {
            tabIndex: 0,
            'data-render-model-index': renderModelIndex,
            'data-query-builder-element': true,
            role: 'button',
            'aria-label': arialLabel,
            ...interactivitySideEffectProps,
            onKeyUp: event => {
              interactivitySideEffectProps.onKeyUp(event);

              // stopped propagation indicated that this is an interaction that is handled via
              // the interactivity side effects.
              if (!event.isPropagationStopped()) {
                onElementKeyUp({ event, renderModelIndex, formModelIndex, onRemove });
              }
            }
          }
        });
      }}
    </Overlay>
  );

  function onChange(newLogicalOperator) {
    switch (newLogicalOperator) {
      case and:
      case or:
      case not:
        onChangeInFormModel({
          type: CONJUNCTION,
          logicalOperator: newLogicalOperator
        });
        break;
      case openBracket:
        onChangeInFormModel({
          type: OPEN_BRACKET
        });
        break;
      case closeBracket:
        onChangeInFormModel({
          type: CLOSE_BRACKET
        });
        break;
      case clear:
        onRemove(formModelIndex, renderModelIndex - 1);
        break;
    }
  }
}
