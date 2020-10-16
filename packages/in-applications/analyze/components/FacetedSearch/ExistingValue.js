import React from 'react';

import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './Suggestion.mless';

export default function ExistingValue({ value, tag, entity, removeFilter }) {
  return (
    <div className={locals.suggestion}>
      <Tooltip content={value}>
        <span className={locals.label}>{value}</span>
      </Tooltip>
      <SvgIcon
        type="lib_openclose_cancel"
        size="s"
        onClick={() =>
          removeFilter({
            type: TAG,
            name: tag,
            operator: EQUALS,
            value,
            ...(entity && { entity })
          })
        }
      />
    </div>
  );
}

export function existingValuesForTag(tag, entity, tagFilterExpression) {
  const singleFilterValue =
    tagFilterExpression.type === TAG_FILTER_TYPE &&
    tagFilterExpression.name === tag &&
    tagFilterExpression.operator === EQUALS &&
    tagFilterExpression.entity === entity &&
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
          element.entity === entity &&
          element.operator === EQUALS
      )
      .map(element => element.value)
      .filter(value => value != null)
  );
}
