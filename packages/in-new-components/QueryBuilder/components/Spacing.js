import React from 'react';

import { LETTER, WORD, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/renderModel';
import TagSelectorOverlay from 'in-new-components/QueryBuilder/TagSelectorOverlay/TagSelectorOverlay';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { isDefaultInteractionTrigger } from 'in-new-components/interactiveCustomElement';
import { ADD_CLOSING_BRACKET } from 'in-new-components/QueryBuilder/validation/bracket';
import { ADD_CONJUNCTION } from 'in-new-components/QueryBuilder/validation/spacing';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import { CLOSE_BRACKET } from '../transformation/formModel';
import Overlay from 'in-new-components/overlays/Overlay';
import useObservable from 'in-hooks/useObservable';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Spacing.mless';

export default function Spacing({
  element,
  onRemove,
  tagCatalog,
  onAdd: onAddToFormModel,
  draggedFormModelIndex$,
  dragAndDropProps
}) {
  const { renderModelIndex, leftFormModelIndex, rightFormModelIndex, suggestions, size } = element;
  const isHighlightedThroughDrag = useObservable(
    draggedFormModelIndex$
      .distinct()
      .map(draggedFormModelIndex => rightFormModelIndex === draggedFormModelIndex)
      .distinct(),
    [draggedFormModelIndex$, rightFormModelIndex]
  );

  return (
    <Overlay
      align="bottomMiddle"
      content={TagSelectorOverlay}
      props={{
        tagCatalog,
        onChange: onAddToFormModel
      }}
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
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
          onKeyDown={onKeyDown}
          onKeyUp={e => onKeyUp(e, openTagSuggestionOverlay)}
          {...dragAndDropProps}
          ref={refSetter}
        >
          {renderSuggestion({ toggle, suggestions, onAddToFormModel })}
          &nbsp;
        </div>
      )}
    </Overlay>
  );

  function onKeyUp(e, openTagSuggestionOverlay) {
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
    }
  }
}

function onKeyDown(e) {
  if (isDefaultInteractionTrigger(e)) {
    // Need to stop this already in onKeyDown as otherwise the browser
    // may start to scroll when using the spacebar to trigger the default
    // interaction.
    stopPropagationAndPreventDefault(e);
  }
}

function renderSuggestion({ toggle, suggestions, onAddToFormModel }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className={locals.addIndicator} onClick={toggle}>
        <SvgIcon type="lib_openclose_add" className={locals.addIndicatorIcon} size="xxs" />
      </div>
    );
  }

  const suggestion = suggestions[0];
  if (suggestion.type === ADD_CONJUNCTION) {
    return (
      <div
        className={locals.addSuggestionIndicator}
        onClick={() =>
          onAddToFormModel({
            type: CONJUNCTION,
            logicalOperator: and
          })
        }
      >
        AND
      </div>
    );
  }

  if (suggestion.type === ADD_CLOSING_BRACKET) {
    return (
      <div className={locals.closeBracketSuggestionIndicator} onClick={() => onAddToFormModel({ type: CLOSE_BRACKET })}>
        {`)`}
      </div>
    );
  }

  return null;
}
