/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import Header from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/Header';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';

export default function LoadingCallDetails({ onClose, progress }) {
  return (
    <Fragment>
      <Header onClose={onClose} />
      <HorizontalIndicator progress={progress} />
    </Fragment>
  );
}
