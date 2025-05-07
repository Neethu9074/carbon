/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Pill } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from './BadgeList.mless';

interface BadgeListProps<T extends string> {
  /** @param type Single badge text */
  type: T;
  /** @param types Array of multiple badge texts */
  types: T[];
  /** @param getColor function to return colour based on badge text*/
  getColor: (type: T) => string;
  /** @param limit Maximum number of badges to show*/
  limit?: number;
}
export default function BadgeList<T extends string>({ type, types, getColor, limit }: BadgeListProps<T>) {
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
      <Pill key={firstRemainingType} className={locals.badge} type={'purple'}>
        {'+' + remainingTypes.length}
      </Pill>
    </Tooltip>
  ) : null;

  return (
    <Fragment>
      {typesToDisplay
        .slice()
        .sort()
        .map(type => {
          const colorForType = getColor(type);
          return (
            // @ts-expect-error string not assignable to CarbonTag type , see TagBaseProps type
            <Pill key={type} className={locals.badge} type={colorForType}>
              {type}
            </Pill>
          );
        })}
      {remainingTooltip}
    </Fragment>
  );
}
