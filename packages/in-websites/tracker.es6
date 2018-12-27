import { createTracker } from 'in-services/tracking/mixpanel';

export const clickNewWebsiteTracker = createTracker('websites.click.new');
export const returnToClassicTracker = createTracker('websites.returnToClassic');
export const navigateToBackendTraceFromPageLoad = createTracker('websites.navigateToBackendTraceFromPageLoad');
export const navigateToPageLoadFromBackendTrace = createTracker('websites.navigateToPageLoadFromBackendTrace');
