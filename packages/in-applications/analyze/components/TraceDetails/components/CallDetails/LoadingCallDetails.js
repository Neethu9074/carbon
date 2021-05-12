/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { HorizontalIndicator } from '@instana/components';

import Header from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/Header';

export default function LoadingCallDetails({ onClose, progress }) {
  return (
    <Fragment>
      <Header onClose={onClose} />
      <HorizontalIndicator progress={progress} />
    </Fragment>
  );
}
