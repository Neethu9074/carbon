/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ApplicationMapTootlip from 'in-applications/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import Header from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/Header';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';

export default function ErroneousServiceInformation({ service, errors }) {
  return (
    <ApplicationMapTootlip
      renderHeader={() => <Header service={service} />}
      renderContent={() => <ErroneousResultPresenter errors={errors} />}
    />
  );
}
