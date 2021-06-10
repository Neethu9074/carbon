/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { openBracket, closeBracket } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import ConjunctionOrBracketBehavior from 'in-components/QueryBuilder/components/ConjunctionOrBracketBehavior';
import { OPEN_BRACKET } from 'in-components/QueryBuilder/transformation/renderModel';
import useThemedLocals from 'in-hooks/useThemedLocals';
import { t } from 'in-i18n';

import styleDefs from './Bracket.mless';

export default function Bracket(props) {
  const { element, renderModelIndex, dragAndDropProps } = props;
  const locals = useThemedLocals(styleDefs);

  return (
    <ConjunctionOrBracketBehavior
      element={element}
      value={element.type === OPEN_BRACKET ? openBracket : closeBracket}
      aria-label={t('in-components:queryBuilder.components.bracketLabelChosenBracket')}
      data-render-model-index={renderModelIndex}
      {...props}
    >
      {({ refSetter, elementProps }) => (
        <div className={locals.draggableWrapper} {...dragAndDropProps}>
          <div
            ref={refSetter}
            {...elementProps}
            className={classNames({
              [locals.bracket]: true,
              [locals.invalid]: element.valid === false
            })}
          >
            {element.type === OPEN_BRACKET ? '(' : ')'}
          </div>
        </div>
      )}
    </ConjunctionOrBracketBehavior>
  );
}
