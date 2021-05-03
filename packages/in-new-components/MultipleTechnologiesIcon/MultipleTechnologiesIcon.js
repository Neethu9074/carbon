/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { getIconType } from 'in-infrastructure/infrastructureIconType';
import { getTechnologyLabel } from 'in-sdk/snapshot';
import Tooltip from 'in-components/Tooltip';

import locals from './MultipleTechnologiesIcon.mless';

export default function MultipleTechnologiesIcon({ type, technologies, icon, size }) {
  const iconType = getIconTypeInternal(type, technologies, icon);

  let technologyLabels = [];
  technologies
    ?.filter(technology => technology !== 'aerospike')
    .map(technology => technologyLabels.push(getTechnologyLabel(technology)));
  const tooltipLabels = technologyLabels.join(', ');

  if (technologies?.length > 1) {
    return (
      <Tooltip content={tooltipLabels}>
        <div className={locals.wrapper}>
          <SvgIcon className={locals.entityIconSmall} type={icon ?? iconType} size={size ?? 's'} />
          <span className={locals.remainderLabel}>+ {technologies.length - 1}</span>
        </div>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip content={tooltipLabels}>
        <div className={locals.wrapper}>
          <SvgIcon className={locals.entityIcon} type={icon ?? iconType} size={size ?? 's'} />
        </div>
      </Tooltip>
    );
  }
}

const getIconTypeInternal = (type, technologies, icon) => {
  let remainder = technologies ? technologies.length - 1 : -1;
  if (icon && (!technologies || technologies?.length === 0)) {
    return;
  }
  if (remainder < 0) {
    return getIconType(type);
  }
  return getIconType(technologies[0]);
};
