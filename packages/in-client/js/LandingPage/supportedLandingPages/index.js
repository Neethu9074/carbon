import * as infrastructureMap from 'in-client/js/LandingPage/supportedLandingPages/infrastructureMap';
import * as customDashboard from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import * as cockpit from 'in-client/js/LandingPage/supportedLandingPages/cockpit';

// Ordered to have sensible defaults.
export default [cockpit, infrastructureMap, customDashboard].filter(({ enabled }) => enabled);
