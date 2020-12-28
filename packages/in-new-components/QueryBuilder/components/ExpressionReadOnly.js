import classNames from 'classnames';
import React from 'react';

import { CLOSE_BRACKET } from 'in-new-components/QueryBuilder/transformation/renderModel';

import locals from './Expression.mless';

export default function ExpressionReadOnly({ children, element: { elements }, depth }) {
  return (
    <div
      className={classNames({
        [locals.expression]: true,
        [locals.completeExpression]: elements[elements.length - 1].type === CLOSE_BRACKET,
        [locals[`expressioncolor_${depth % 2}`]]: true
      })}
    >
      {children}
    </div>
  );
}
