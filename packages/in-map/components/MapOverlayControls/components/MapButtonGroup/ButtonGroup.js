/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonButtonSet } from '@instana/components';

import locals from './ButtonGroup.mless';

export default function ButtonGroup({ children, className, horizontal }) {
  return (
    <CarbonButtonSet className={className} stacked={!horizontal}>
      <div className={locals.carbonButtonSet}>{children}</div>
    </CarbonButtonSet>
  );
}
