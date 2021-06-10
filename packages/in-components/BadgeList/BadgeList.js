/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import Pill from 'in-components/Pill';

import locals from './BadgeList.mless';

export default function BadgeList({ type, types, getColor, kind = 'light' }) {
  if (type && !types) {
    types = [type];
  }
  if (!types || types.length === 0) {
    return null;
  }

  return (
    <Fragment>
      {types
        .slice()
        .sort()
        .map(type => (
          <Pill key={type} className={locals.badge} color={getColor(type)} kind={kind}>
            {type}
          </Pill>
        ))}
    </Fragment>
  );
}
