/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import Pill, { Kind } from 'in-components/Pill';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';

import locals from './BadgeList.mless';

export default function BadgeList<T extends string>({
  type,
  types,
  getColor,
  kind = 'light',
  limit
}: {
  type: T;
  types: T[];
  getColor: (type: T) => string;
  kind?: Kind;
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
      <Pill key={firstRemainingType} className={locals.badge} color={theme.lib.colors.purple800} kind={kind}>
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
          <Pill key={type} className={locals.badge} color={getColor(type)} kind={kind}>
            {type}
          </Pill>
        ))}
      {remainingTooltip}
    </Fragment>
  );
}
