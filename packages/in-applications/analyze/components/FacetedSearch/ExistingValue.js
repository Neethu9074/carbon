/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './Suggestion.mless';

/**
 * A label and a remove icon, wrapped in a tooltip displaying the non-ellipsed label.
 * The value passed in is parsed to a String.
 * This is done since the value may also be a boolean or a number.
 */
export default function ExistingValue({ value, remove }) {
  return (
    <Tooltip content={String(value)} align="rightMiddle" delay={1000}>
      <div className={locals.suggestion}>
        <span className={locals.existingLabel}>{String(value)}</span>
        <SvgIcon className={locals.existingIcon} type="lib_openclose_cancel" size="s" onClick={remove} />
      </div>
    </Tooltip>
  );
}

export function existingValuesForTag(tagFilterExpression, tag, entity) {
  const isSingleFilterValue =
    tagFilterExpression.type === TAG_FILTER_TYPE &&
    tagFilterExpression.name === tag &&
    tagFilterExpression.operator === EQUALS &&
    (!entity || (tagFilterExpression.entity ?? DESTINATION) === entity);
  if (isSingleFilterValue) {
    return [tagFilterExpression.value];
  }
  return (
    tagFilterExpression.type === EXPRESSION &&
    tagFilterExpression.logicalOperator === OPERATOR_AND &&
    tagFilterExpression.elements
      .filter(
        element =>
          element.type === TAG_FILTER_TYPE &&
          element.name === tag &&
          (!entity || (tagFilterExpression.entity ?? DESTINATION) === entity) &&
          element.operator === EQUALS
      )
      .map(element => element.value)
  );
}
