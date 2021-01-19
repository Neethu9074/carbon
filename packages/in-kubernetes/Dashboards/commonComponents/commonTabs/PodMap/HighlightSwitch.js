/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Toggle from 'in-components/form/Toggle';

import locals from './HighlightSwitch.mless';

export default function HighlightSwitch(props) {
  const { showHealth, setShowHealth } = props;

  return (
    <div className={locals.wrapper}>
      <span className={locals.label}>Highlight unhealthy</span>
      <Toggle checked={showHealth} onChange={e => setShowHealth(e.target.checked)} />
    </div>
  );
}
