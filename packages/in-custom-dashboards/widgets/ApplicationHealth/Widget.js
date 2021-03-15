/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ApplicationHealthOverviewPresenter from 'in-custom-dashboards/widgets/ApplicationHealth/ApplicationHealthOverviewPresenter';

export default function ApplicationHealthOverviewWidget({ config, title, actions, dragHandle, isPreview }) {
  return (
    <ApplicationHealthOverviewPresenter
      title={title}
      config={config}
      actions={actions}
      dragHandle={dragHandle}
      isPreview={isPreview}
    />
  );
}
