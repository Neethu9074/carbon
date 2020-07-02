import React from 'react';

import { LETTER, WORD } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { isDefaultInteractionTrigger } from 'in-new-components/interactiveCustomElement';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Spacing.mless';

export default function Spacing({ renderModelIndex, size, valid, onRemove, leftFormModelIndex, rightFormModelIndex }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.letter]: size === LETTER.size,
        [locals.word]: size === WORD.size,
        [locals.invalid]: valid === false
      })}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      <div className={locals.addIndicator} onClick={onOpenAddDialog}>
        <SvgIcon type="lib_openclose_add" className={locals.addIndicatorIcon} size="xxs" />
      </div>
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
