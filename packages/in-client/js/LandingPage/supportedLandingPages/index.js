/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import * as customDashboard from 'in-client/js/LandingPage/supportedLandingPages/customDashboards';
import * as cockpit from 'in-client/js/LandingPage/supportedLandingPages/cockpit';

// Ordered to have sensible defaults.
export default [cockpit, customDashboard].filter(({ enabled }) => enabled);
