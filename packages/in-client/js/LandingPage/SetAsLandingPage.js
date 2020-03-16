import { getActiveConfiguration$ } from 'in-client/js/LandingPage/activeConfigration';
import { landingPageConfigurationEnabled } from 'in-services/featureFlags';
import connectTo from 'in-hoc/connectTo';

const label = 'Make Homepage';
const icon = 'lib_views_grid';

export default connectTo(({ isLandingPage }) => ({
  isAlreadyLandingPage: getActiveConfiguration$().map(({ pageKey }) => isLandingPage(pageKey))
}))(SetAsLandingPage);

function SetAsLandingPage({ isAlreadyLandingPage, children }) {
  if (isAlreadyLandingPage || !landingPageConfigurationEnabled) {
    return null;
  }
  return children({ isAlreadyLandingPage, label, icon });
}
