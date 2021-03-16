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

export default function ExistingValue({ value, removeLink }) {
  return (
    <div className={locals.suggestion}>
      <Tooltip content={value}>
        <span className={locals.label}>{value}</span>
      </Tooltip>
      <Link href={removeLink}>
        <SvgIcon className={locals.icon} type="lib_openclose_cancel" size="s" />
      </Link>
    </div>
  );
}

export function getExistingValuesForTag(formModel, tag, entity) {
  const backendQueryModel = toBackendQueryModel(formModel);
  const singleFilterValue =
    backendQueryModel.type === TAG_FILTER_TYPE &&
    backendQueryModel.name === tag &&
    backendQueryModel.operator === EQUALS &&
    (!entity || (backendQueryModel.entity ?? DESTINATION) === entity) &&
    backendQueryModel.value !== null &&
    backendQueryModel.value;
  if (singleFilterValue) {
    return [singleFilterValue];
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
        .filter(value => value != null)
    : emptyArray;
}
