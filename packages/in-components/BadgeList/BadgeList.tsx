/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { themes } from '@instana/design-tokens';
import { Pill } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from './BadgeList.mless';

export default function BadgeList<T extends string>({
  type,
  types,
  getColor,
  limit
}: {
  type: T;
  types: T[];
  getColor: (type: T) => string;
  limit?: number;
}) {
  if (type && !types) {
    types = [type];
  }
  if (!types || types.length === 0) {
    return null;
  }
  const limitRequired = limit && types.length > limit;

  const typesToDisplay = limitRequired ? types.slice(0, limit) : types;
  const remainingTypes = limitRequired ? types.slice(limit) : [];
  const firstRemainingType = remainingTypes[0];

  const remainingTooltip = limitRequired ? (
    <Tooltip align={'topMiddle'} content={remainingTypes.join(', ')}>
      <Pill key={firstRemainingType} className={locals.badge} color={themes.default.ids.color.option.purple['500']}>
        {'+' + remainingTypes.length}
      </Pill>
    </Tooltip>
  ) : null;

  return (
    <Fragment>
      {typesToDisplay
        .slice()
        .sort()
        .map(type => (
          <Pill key={type} className={locals.badge} color={getColor(type)}>
            {type}
          </Pill>
        ))}
      {remainingTooltip}
    </Fragment>
  );
}
