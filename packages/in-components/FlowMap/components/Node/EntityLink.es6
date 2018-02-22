import React from 'react';

import { serviceId as matrixServiceId } from 'in-applications/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Link from 'in-components/Link';

import locals from './EntityLink.mless';

export default function EntityLink({ data, className }) {
  return (
    <div className={`${locals.entityLink} ${className}`}>
      <Link href$={getLinkToEntitiesFlowMap(data.id)}>{data.label}</Link>
    </div>
  );
}

function getLinkToEntitiesFlowMap(id) {
  return getModifiedUrlStream(params => {
    const view = params.pathname.replace(/\/flowMap/, '');
    setOrDeleteMatrixKey(params, view, matrixServiceId, id);
  });
}
