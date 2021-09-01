/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DominoCustomMetrics from 'in-forge/plugins/domino/Dashboard/DominoCustomMetrics';

export default function DominoDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DominoCustomMetrics snapshot={snapshot} timeConfig={timeConfig} titlePrefix="Domino" />;
    </div>
  );
}
