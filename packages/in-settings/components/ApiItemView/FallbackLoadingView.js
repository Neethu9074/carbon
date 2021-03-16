/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { LoadingIndicator } from 'in-new-components/LoadingIndicators';

export default function renderFallbackLoadingView() {
  return (
    <>
      <LoadingIndicator size="xxxl" />
    </>
  );
}
