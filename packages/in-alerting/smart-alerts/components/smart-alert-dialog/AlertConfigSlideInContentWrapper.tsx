/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import locals from './AlertConfigSlideInContentWrapper.mless';

export default function AlertConfigSlideInContentWrapper({ children }) {
  return <div className={locals.slideInContentWrapper}>{children}</div>;
}
