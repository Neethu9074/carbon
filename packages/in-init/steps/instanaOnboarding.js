import { just, create } from 'reactive-observables';
import ReactDOM from 'react-dom';
import React from 'react';

// we want to split the codebase of the onboarding dialog from the main bundle.
// so we don't have to load the bundle when it's not neededd.
import InstanaOnboardingComponent from 'promise-loader?global,onboarding!in-init/steps/InstanaOnboardingComponent';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { isOnboardingGuideEnabled } from 'in-services/featureFlags';

export function init() {
  const reportingData = window.instana.reportingData;
  // the onboarding dialog is skipped when ther are reporting hosts right now
  if (!isOnboardingGuideEnabled || (reportingData && reportingData.hostCount > 0)) {
    return just(true);
  }

  const observable = create();
  const Component = createAsyncViewComponent(InstanaOnboardingComponent);
  ReactDOM.render(<Component observable={observable} />, document.getElementById('main'));

  // Force stop the UI init process at this step. The onboarding dialog will
  // force a page reload once completed.
  return observable;
}
