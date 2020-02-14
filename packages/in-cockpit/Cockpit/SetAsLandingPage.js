import { compose, withProps } from 'recompose';

import { setLandingPage, isLandingPage } from 'in-client/js/LandingPage/supportedLandingPages/cockpit';
import SetAsLandingPage from 'in-client/js/LandingPage/SetAsLandingPage';

export default compose(
  withProps({
    setLandingPage,
    isLandingPage
  })
)(SetAsLandingPage);
