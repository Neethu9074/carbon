/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
import { boundaryScopes } from 'in-applications/constants';

export default {
  component: CreateApplicationDialog
};

export const Dialog = () => (
  <CreateApplicationDialog
    formData={{
      label: '',
      matchSpecification: [],
      scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
      boundaryScope: boundaryScopes.inbound
    }}
  />
);
