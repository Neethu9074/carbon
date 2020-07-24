import React from 'react';

import TagSelectorOverlay from 'in-new-components/QueryBuilder/TagSelectorOverlay/TagSelectorOverlay';
import { LETTER, WORD } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { isDefaultInteractionTrigger } from 'in-new-components/interactiveCustomElement';
import Suggestions from 'in-new-components/QueryBuilder/components/Spacing/Suggestions';
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
      content={TagSelectorOverlay}
      props={{
        tagCatalog,
        onChange: onAddToFormModel
      }}
      onCloseSideEffect={() => focus(renderModelIndex)}
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
          <Suggestions toggle={toggle} suggestions={suggestions} onAddToFormModel={onAddToFormModel} />
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
