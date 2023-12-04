/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import * as operatorLabels from 'in-components/QueryBuilder/tagFilter/operatorLabelsMapping';

import locals from './Operator.mless';

export default function OperatorReadOnly({ element: { operator }, tagType }) {
  return (
    <div
      className={classNames({
        [locals.operator_disablehover]: true
      })}
    >
      {operatorLabels[`${tagType}_${operator}`]}
    </div>
  );
}
