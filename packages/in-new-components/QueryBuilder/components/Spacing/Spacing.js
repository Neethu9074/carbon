import React, { useRef } from 'react';

import {
  LETTER,
  WORD,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  CONJUNCTION
} from 'in-new-components/QueryBuilder/transformation/renderModel';
import ConjunctionTagSelectorOverlay from 'in-new-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionTagSelectorOverlay';
import { isPrimaryInteractiveElement, isDefaultInteractionTrigger } from 'in-new-components/interactiveCustomElement';
import { and, or, not } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import Suggestions from 'in-new-components/QueryBuilder/components/Spacing/Suggestions';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import Overlay from 'in-new-components/overlays/Overlay';
import useObservable from 'in-hooks/useObservable';
import keyCodes from 'in-components/keyCodes';

import locals from './Spacing.mless';

export default function Spacing({
  element,
  onRemove,
  tagCatalog,
  focus,
  onAdd: onExternalAddToFormModel,
  draggedFormModelIndex$,
  dragAndDropProps
}) {
  // We must not execute the onCloseSideEffect when we just triggered a form model change
  // as this would place the focus onto the wrong element.
  const lastTimeExternalAddToFormModelWasCalledRef = useRef();
  const { renderModelIndex, leftFormModelIndex, rightFormModelIndex, suggestions, size } = element;
  const isHighlightedThroughDrag = useObservable(getIsHighlightedThroughDrag, [
    draggedFormModelIndex$,
    rightFormModelIndex
  ]);

  return (
    <Overlay
      content={ConjunctionTagSelectorOverlay}
      props={{
        tagCatalog,
        onChange: onAddToFormModel
      }}
      align="bottomMiddle"
      onCloseSideEffect={() => {
        if (
          lastTimeExternalAddToFormModelWasCalledRef.current == null ||
          lastTimeExternalAddToFormModelWasCalledRef.current < Date.now() - 500
        ) {
          focus(renderModelIndex);
        }
      }}
      withoutWrapper
    >
      {({ toggle, open: openTagSuggestionOverlay, refSetter }) => (
        <div
          className={evaluateClassNames({
            [locals.visible]: isHighlightedThroughDrag,
            [locals.letter]: size === LETTER.size,
            [locals.word]: size === WORD.size
          })}
          tabIndex={0}
          data-render-model-index={renderModelIndex}
          data-query-builder-element="true"
          data-query-builder-space-element="true"
          onKeyDown={e => onKeyDown(e, openTagSuggestionOverlay)}
          {...dragAndDropProps}
          ref={refSetter}
        >
          <div className={locals.hoverEnabler} />
          <Suggestions toggle={toggle} suggestions={suggestions} onAddToFormModel={onAddToFormModel} />
          &nbsp;
        </div>
      )}
    </Overlay>
  );

  function onAddToFormModel(opts) {
    if (opts.type === 'TAG_FILTER') {
      const tagTreeNode = tagCatalog.tagsByName[opts.name];
      if (tagTreeNode.canApplyToSource && tagTreeNode.canApplyToDestination) {
        opts.entity = DESTINATION;
      }
    }
    lastTimeExternalAddToFormModelWasCalledRef.current = Date.now();
    return onExternalAddToFormModel(opts);
  }

  function onKeyDown(e, openTagSuggestionOverlay) {
    if (isPrimaryInteractiveElement(e.target)) {
      // Do execute custom keyboard logic when typing in regular input fields
      return;
    }

    if (isDefaultInteractionTrigger(e)) {
      stopPropagationAndPreventDefault(e);
      openTagSuggestionOverlay();
    } else if (onRemove && e.keyCode === keyCodes.backspace) {
      stopPropagationAndPreventDefault(e);
      // Deleting a single element also deletes the whitespace element.
      onRemove(leftFormModelIndex, renderModelIndex - 2);
    } else if (onRemove && e.keyCode === keyCodes.delete) {
      stopPropagationAndPreventDefault(e);
      onRemove(rightFormModelIndex, renderModelIndex);
    } else if (e.key === '(') {
      stopPropagationAndPreventDefault(e);
      onAddToFormModel({
        type: OPEN_BRACKET
      });
    } else if (e.key === ')') {
      stopPropagationAndPreventDefault(e);
      onAddToFormModel({
        type: CLOSE_BRACKET
      });
    } else if (e.key === '&') {
      stopPropagationAndPreventDefault(e);
      onAddToFormModel({
        type: CONJUNCTION,
        logicalOperator: and
      });
    } else if (e.key === '|') {
      stopPropagationAndPreventDefault(e);
      onAddToFormModel({
        type: CONJUNCTION,
        logicalOperator: or
      });
    } else if (e.key === '!') {
      stopPropagationAndPreventDefault(e);
      onAddToFormModel({
        type: CONJUNCTION,
        logicalOperator: not
      });
    }
  }
}

function getIsHighlightedThroughDrag([draggedFormModelIndex$, rightFormModelIndex]) {
  return draggedFormModelIndex$
    .distinct()
    .map(draggedFormModelIndex => rightFormModelIndex === draggedFormModelIndex)
    .distinct();
}
