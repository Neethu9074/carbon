/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import {
  EXPRESSION,
  OPERATOR_AND,
  toBackendQueryModel
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { emptyArray } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './ExistingValue.mless';

/**
 * A label and a remove icon, wrapped in a tooltip displaying the non-ellipsed label.
 * The value passed in is parsed to a String.
 * This is done since the value may also be a boolean or a number.
 */
export default function ExistingValue({ value, removeLink }) {
  return (
    <Tooltip content={String(value)} align="rightMiddle" delay={1000}>
      <div className={locals.suggestion}>
        <span className={locals.label}>{String(value)}</span>
        <Link href={removeLink}>
          <SvgIcon className={locals.icon} type="lib_openclose_cancel" size="s" />
        </Link>
      </div>
    </Tooltip>
  );
}

export function getExistingValuesForTag(formModel, tag, entity) {
  const backendQueryModel = toBackendQueryModel(formModel);
  const isSingleFilterValue =
    backendQueryModel.type === TAG_FILTER_TYPE &&
    backendQueryModel.name === tag &&
    backendQueryModel.operator === EQUALS &&
    (!entity || (backendQueryModel.entity ?? DESTINATION) === entity);
  if (isSingleFilterValue) {
    return [backendQueryModel.value];
  }
  return backendQueryModel.type === EXPRESSION && backendQueryModel.logicalOperator === OPERATOR_AND
    ? backendQueryModel.elements
        .filter(
          element =>
            element.type === TAG_FILTER_TYPE &&
            element.name === tag &&
            (!entity || (backendQueryModel.entity ?? DESTINATION) === entity) &&
            element.operator === EQUALS
        )
        .map(element => element.value)
    : emptyArray;
}
