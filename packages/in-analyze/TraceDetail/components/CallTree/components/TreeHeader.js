/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CallTimeAxis from 'in-analyze/TraceDetail/components/CallTimeAxis/CallTimeAxis';

import locals from './TreeHeader.mless';

export default function TreeHeader({ rootCall }) {
  return (
    <div className={locals.treeHeader}>
      <div className={locals.axis}>{rootCall && <CallTimeAxis call={rootCall} />}</div>
    </div>
  );
}
