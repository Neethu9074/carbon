import React from 'react';

import { LETTER, WORD, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { isDefaultInteractionTrigger } from 'in-new-components/interactiveCustomElement';
import { ADD_CLOSING_BRACKET } from 'in-new-components/QueryBuilder/validation/bracket';
import { ADD_CONJUNCTION } from 'in-new-components/QueryBuilder/validation/spacing';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import { CLOSE_BRACKET } from '../transformation/formModel';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Spacing.mless';

export default function Spacing({
  renderModelIndex,
  size,
  suggestions,
  onRemove,
  onAdd: onAddToFormModel,
  leftFormModelIndex,
  rightFormModelIndex
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.letter]: size === LETTER.size,
        [locals.word]: size === WORD.size
      })}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      {renderSuggestion(suggestions, onOpenAddDialog, onAddToFormModel)}
      &nbsp;
    </div>
  );

  function onKeyUp(e) {
    if (isDefaultInteractionTrigger(e)) {
      stopPropagationAndPreventDefault(e);
      onOpenAddDialog();
    } else if (onRemove && e.keyCode === keyCodes.backspace) {
      stopPropagationAndPreventDefault(e);
      // Deleting a single element also deletes the whitespace element.
      onRemove(leftFormModelIndex, renderModelIndex - 2);
    } else if (onRemove && e.keyCode === keyCodes.delete) {
      stopPropagationAndPreventDefault(e);
      onRemove(rightFormModelIndex, renderModelIndex);
    }
  }

  function onOpenAddDialog() {
    // eslint-disable-next-line
    console.log('TODO show add tag dialog');
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

function renderSuggestion(suggestions, onOpenAddDialog, onAddToFormModel) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className={locals.addIndicator} onClick={onOpenAddDialog}>
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
