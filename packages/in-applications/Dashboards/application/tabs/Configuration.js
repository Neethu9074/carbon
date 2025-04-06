/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CreateApplicationDialog from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import RemoveSection from 'in-applications/Forms/NewApplication/RemoveSection';

export default function Configuration({ timeConfig, data: application, applicationId }) {
  return (
    <>
      <CreateApplicationDialog applicationId={applicationId} timeConfig={timeConfig} />
      <RemoveSection application={application} />
    </>
  );
}
