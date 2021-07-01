/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ApplicationHealthOverview from 'in-custom-dashboards/widgets/ApplicationHealth/ApplicationHealthOverviewPresenter';

export default function ApplicationHealthOverviewWidget({ config, title, actions, dragHandle, isPreview }) {
  return (
    <ApplicationHealthOverview
      title={title}
      config={config}
      actions={actions}
      dragHandle={dragHandle}
      isPreview={isPreview}
    />
  );
}
