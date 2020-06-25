import React from 'react';

import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
import { boundaryScopes } from 'in-applications/constants';

export default {
  title: 'Templates|application/CreateApplicationDialog',
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
