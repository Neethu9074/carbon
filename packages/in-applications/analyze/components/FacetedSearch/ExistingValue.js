/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './Suggestion.mless';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';

export default function ExistingValue({ value, remove }) {
  return (
    <div className={locals.suggestion}>
      <Tooltip content={value}>
        <span className={locals.label}>{value}</span>
      </Tooltip>
      <SvgIcon type="lib_openclose_cancel" size="s" onClick={remove} />
    </div>
  );
}

export function existingValuesForTag(tagFilterExpression, tag, entity) {
  const singleFilterValue =
    tagFilterExpression.type === TAG_FILTER_TYPE &&
    tagFilterExpression.name === tag &&
    tagFilterExpression.operator === EQUALS &&
    (!entity || (tagFilterExpression.entity ?? DESTINATION) === entity) &&
    tagFilterExpression.value !== null &&
    tagFilterExpression.value;
  if (singleFilterValue) {
    return [singleFilterValue];
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
      .filter(value => value != null)
  );
}
