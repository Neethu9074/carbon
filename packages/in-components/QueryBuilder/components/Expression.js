/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { isPrimaryInteractiveElement } from '@instana/components';

import { CLOSE_BRACKET } from 'in-components/QueryBuilder/transformation/renderModel';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { isBackspace, isDelete } from 'in-components/keyCodes';

import locals from './Expression.mless';

export default function Expression({ onRemove, children, element: { elements }, depth }) {
  return (
    <div
      className={classNames({
        [locals.expression]: true,
        [locals.completeExpression]: elements[elements.length - 1].type === CLOSE_BRACKET,
        [locals[`expressioncolor_${depth % 2}`]]: true
      })}
      tabIndex={0}
      data-query-builder-element="true"
      onKeyUp={onKeyUp}
    >
      {children}
    </div>
  );

  function onKeyUp(event) {
    if (!onRemove || isPrimaryInteractiveElement(event.target)) {
      return;
    }

    if (isBackspace(event) || isDelete(event)) {
      stopPropagationAndPreventDefault(event);
      const startFormModelIndex = elements[0].formModelIndex;
      const endFormModelIndex = elements[elements.length - 1].formModelIndex;
      onRemove(startFormModelIndex, elements[0].renderModelIndex - 1, endFormModelIndex - startFormModelIndex + 1);
    }
  }
}
