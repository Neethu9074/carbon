import React from 'react';

import { getActiveConfiguration$ } from 'in-client/js/LandingPage/activeConfigration';
import { landingPageConfigurationEnabled } from 'in-services/featureFlags';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ isLandingPage }) => ({
  isAlreadyLandingPage: getActiveConfiguration$().map(({ pageKey }) => isLandingPage(pageKey))
}))(SetAsLandingPage);

function SetAsLandingPage({ isAlreadyLandingPage, setLandingPage }) {
  if (isAlreadyLandingPage || !landingPageConfigurationEnabled) {
    return null;
  }

  return (
    <Button kind="secondary" onClick={setLandingPage}>
      Set as landing page
    </Button>
  );
}
