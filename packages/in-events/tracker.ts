/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  VULNERABILITIES_TAB_IN_APP_CLICK,
  VULNERABILITIES_BUTTON_IN_CONTAINER_DASHBOARD_CLICK,
  VULNERABILITIES_CSV_EXPORT_CLICK,
  CVE_TAB_IN_VULNERABILITIES_CLICK,
  DETECTIONS_TAB_IN_VULNERABILITIES_CLICK
} from 'in-services/tracking/tracking';
import { CtaTrackingFunction, UnstableTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { UI_INTERACTION } from 'in-services/util/constants';

// Application Dashboard
export const clickVulnerabilitiesTabInApplicationsTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(VULNERABILITIES_TAB_IN_APP_CLICK, {
    type: 'TabView',
    text: 'Vulnerabilities tab in applications section'
  });
};

// Container Dashboard
export const clickVulnerabilitiesButtonInContainersDashboardTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(VULNERABILITIES_BUTTON_IN_CONTAINER_DASHBOARD_CLICK, {
    type: 'Button',
    text: 'Vulnerabilities button on container dashboard'
  });
};

export const clickVulnerabilityInContainerDashboardTracker = (unstable_trackEvent: UnstableTrackingFunction) => {
  if (unstable_trackEvent) {
    unstable_trackEvent(
      UI_INTERACTION,
      { objectType: 'MenuItem' },
      { text: 'Vulnerability from vulnerabilities drop-down menu on container dashboard click' }
    );
  }
};

export const clickViewAllVulnerabilitiesInContainerDashboardTracker = (
  unstable_trackEvent: UnstableTrackingFunction
) => {
  if (unstable_trackEvent) {
    unstable_trackEvent(
      UI_INTERACTION,
      { objectType: 'Button' },
      { text: 'View all vulnerabilities from vulnerabilities drop-down menu on container dashboard click' }
    );
  }
};

// Vulnerabilities
export const clickCsvExportTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(VULNERABILITIES_CSV_EXPORT_CLICK, {
    type: 'Button',
    text: 'CSV Export on vulnerabilities'
  });
};

export const clickVulnerabilitiesInNavigationTracker = (unstable_trackEvent: UnstableTrackingFunction) => {
  if (unstable_trackEvent) {
    unstable_trackEvent(UI_INTERACTION, { objectType: 'Button' }, { text: 'Vulnerabilities navigation click' });
  }
};

export const clickCveTabInVulnerabilitiesTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(CVE_TAB_IN_VULNERABILITIES_CLICK, {
    type: 'TabView',
    text: 'Cve tab in vulnerabilities'
  });
};

export const clickDetectionsTabInVulnerabilitiesTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(DETECTIONS_TAB_IN_VULNERABILITIES_CLICK, {
    type: 'TabView',
    text: 'Detections tab in vulnerabilities'
  });
};
