/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/renderModel';
import { ADD_CLOSING_BRACKET } from 'in-new-components/QueryBuilder/validation/bracket';
import { CLOSE_BRACKET } from 'in-new-components/QueryBuilder/transformation/formModel';
import { ADD_CONJUNCTION } from 'in-new-components/QueryBuilder/validation/spacing';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './Spacing.mless';

export default function Suggestion({ toggle, suggestions, onAddToFormModel }) {
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
        onClick={() => onAddToFormModel(translateSuggestionToNewFormModelElement(suggestion))}
      >
        {t('in-new-components:queryBuilder.components.spacingSuggestionAnd')}
      </div>
    );
  }

  if (suggestion.type === ADD_CLOSING_BRACKET) {
    return (
      <div
        className={locals.closeBracketSuggestionIndicator}
        onClick={() => onAddToFormModel(translateSuggestionToNewFormModelElement(suggestion))}
      >
        {`)`}
      </div>
    );
  }

  return null;
}

export function translateSuggestionToNewFormModelElement(suggestion) {
  if (suggestion.type === ADD_CONJUNCTION) {
    return {
      type: CONJUNCTION,
      logicalOperator: and
    };
  } else if (suggestion.type === ADD_CLOSING_BRACKET) {
    return { type: CLOSE_BRACKET };
  } else {
    throw new Error('Unsupported suggestion: ' + suggestion.type);
  }
}
