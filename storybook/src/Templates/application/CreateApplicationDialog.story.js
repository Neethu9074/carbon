import React from 'react';

import CreateApplicationDialogWrapper from 'in-applications/creation/Dialog/CreateApplicationDialogWrapper';
import { boundaryScopes } from 'in-applications/constants';

export default {
  title: 'Templates|application/CreateApplicationDialog',
  component: CreateApplicationDialogWrapper
};

export const Dialog = () => (
  <CreateApplicationDialogWrapper
    formData={{
      label: '',
      matchSpecification: [],
      scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
      boundaryScope: boundaryScopes.inbound
    }}
  />
);
