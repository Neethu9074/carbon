import { compose, withProps } from 'recompose';

import { setLandingPage, isLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import SetAsLandingPage from 'in-client/js/LandingPage/SetAsLandingPage';

export default compose(
  withProps(({ customDashboardId }) => ({
    setLandingPage: () => setLandingPage(customDashboardId),
    isLandingPage: pageKey => isLandingPage(pageKey, customDashboardId)
  }))
)(SetAsLandingPage);
