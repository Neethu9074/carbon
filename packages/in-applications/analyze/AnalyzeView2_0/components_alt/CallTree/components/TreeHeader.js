/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CallTimeAxis from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTimeAxis';

import locals from './TreeHeader.mless';

export default function TreeHeader({ rootCall }) {
  return (
    <div className={locals.treeHeader}>
      <div className={locals.axis}>{rootCall && <CallTimeAxis call={rootCall} />}</div>
    </div>
  );
}
