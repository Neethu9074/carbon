/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// we want to split the codebase of the onboarding dialog from the main bundle.
// so we don't have to load the bundle when it's not neededd.
import InstanaOnboardingComponent from 'promise-loader?global,onboarding!in-init/steps/InstanaOnboardingComponent';
import { create, just } from '@instana/observables';
import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import history from 'in-stores/navigation/history';

export function init() {
  const reportingData = window.instana.reportingData;
  // The onboarding dialog is skipped when there are reporting hosts or monitored serverless entities.
  if (reportingData && (reportingData.hostCount > 0 || reportingData.serverlessCount > 0)) {
    return just(true);
  }

  const observable = create();
  const Component = createAsyncViewComponent(InstanaOnboardingComponent);
  ReactDOM.render(
    <Router history={history}>
      <Component onDialogSkip={() => observable.emit(true)} />
    </Router>,
    document.getElementById('main')
  );

  // Force stop the UI init process at this step. The onboarding dialog will
  // force a page reload once completed.
  return observable;
}
