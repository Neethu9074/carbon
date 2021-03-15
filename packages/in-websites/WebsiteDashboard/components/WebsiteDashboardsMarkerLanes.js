/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getWebsiteAlertClusters from 'in-websites/subscriptions/getWebsiteAlertClusters';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import AlertsLane from 'in-components/Chart/markerLanes/AlertsLane/AlertsLane';

export default function WebsiteDashboardsMarkerLanes({ websiteId, pageId }) {
  return function MarkerLanesWebsite(lanesProps) {
    return (
      <MarkerLanesPresenter {...lanesProps}>
        <ReleasesLane />
        <AlertsLane
          config={{
            websiteId,
            page: pageId
          }}
          getAlerts={getWebsiteAlertClusters}
        />
      </MarkerLanesPresenter>
    );
  };
}

WebsiteDashboardsMarkerLanes.propTypes = {
  pageId: PropTypes.string,
  websiteId: PropTypes.string.isRequired
};
