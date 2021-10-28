/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './SimpleModeStepContentWrapper.mless';

export interface Props {
  headline: string;
  children: React.ReactNode;
}

export default function SimpleModeStepContentWrapper({ headline, children }: Props) {
  return (
    <div className={locals.container}>
      <h1 className={locals.headline}>{headline}</h1>
      <>{children}</>
    </div>
  );
}
