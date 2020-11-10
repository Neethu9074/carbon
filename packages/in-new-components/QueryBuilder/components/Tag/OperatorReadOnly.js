import React from 'react';

import * as operatorLabels from 'in-new-components/QueryBuilder/tagFilter/operatorLabelsMapping';

import locals from './Operator.mless';

export default function OperatorReadOnly({ element: { operator }, tagType }) {
  return (
    <div className={locals.operator} style={{ cursor: 'not-allowed' }}>
      {operatorLabels[`${tagType}_${operator}`]}
    </div>
  );
}
