/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TraceValidationResult, {
  issueMessages
} from 'in-applications/analyze/components/TraceDetails/tabs/Summary/TraceValidationResult';

export default {
  title: 'Molecules|ProductNotifications/TraceValidation',
  component: TraceValidationResult
};

export function TraceValidation() {
  return (
    <>
      {Object.keys(issueMessages).map(key => (
        <TraceValidationResult key={key} issues={[key]} />
      ))}

      <TraceValidationResult issues={Object.keys(issueMessages)} />
    </>
  );
}
