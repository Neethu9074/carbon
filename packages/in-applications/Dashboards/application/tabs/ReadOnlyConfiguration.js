/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CreateReadOnlyApplicationDialog from 'in-applications/Forms/NewApplication/CreateReadOnlyApplicationDialog';

export default function ReadOnlyConfiguration({ timeConfig, applicationId }) {
  return <CreateReadOnlyApplicationDialog applicationId={applicationId} timeConfig={timeConfig} />;
}
