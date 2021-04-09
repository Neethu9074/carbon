/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import ConjunctionOrBracketBehavior from 'in-new-components/QueryBuilder/components/ConjunctionOrBracketBehavior';
import useThemedLocals from 'in-hooks/useThemedLocals';
import { t } from 'in-i18n';

import styleDefs from './Conjunction.mless';

export default function Conjunction(props) {
  const { element, renderModelIndex, dragAndDropProps } = props;
  const { logicalOperator, valid } = element;
  const locals = useThemedLocals(styleDefs);

  return (
    <ConjunctionOrBracketBehavior
      element={element}
      value={logicalOperator}
      aria-label={t('in-new-components:queryBuilder.components.conjunctionLabelChosenConjunction')}
      {...props}
    >
      {({ refSetter, elementProps }) => (
        <div className={locals.draggableWrapper} data-render-model-index={renderModelIndex} {...dragAndDropProps}>
          <div
            className={classNames({
              [locals.conjunction]: true,
              [locals.invalid]: valid === false
            })}
            ref={refSetter}
            {...elementProps}
          >
            {t('in-new-components:queryBuilder.components.conjunctionLogicalOperator', { context: logicalOperator })}
          </div>
        </div>
      )}
    </ConjunctionOrBracketBehavior>
  );
}
