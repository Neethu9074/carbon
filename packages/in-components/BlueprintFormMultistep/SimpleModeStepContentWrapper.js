/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './SimpleModeStepContentWrapper.mless';

export default function SimpleModeStepContentWrapper({ headline, children }) {
  return (
    <div className={locals.container}>
      <h1 className={locals.headline}>{headline}</h1>
      <>{children}</>
    </div>
  );
}
