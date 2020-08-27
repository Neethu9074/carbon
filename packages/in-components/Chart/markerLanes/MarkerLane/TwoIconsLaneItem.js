import PropTypes from 'prop-types';
import React from 'react';

import SingleMarkerLaneItem from './SingleMarkerLaneItem';

export default function TwoIconsLaneItem({ iconConfigForMultipleAlertTypes, eventData, ...remainingProps }) {
  const clusterSections = Object.keys(iconConfigForMultipleAlertTypes);
  const alertTypeConfig0 = iconConfigForMultipleAlertTypes[clusterSections[0]];
  const alertTypeConfig1 = iconConfigForMultipleAlertTypes[clusterSections[1]];

  return <SingleMarkerLaneItem {...remainingProps} {...getIconRenderState()} eventData={eventData} />;

  function getIconRenderState() {
    const alertTypeZeroHasItems = eventData[clusterSections[0]]?.length;
    const alertTypeOneHasItems = eventData[clusterSections[1]]?.length;
    let showIconForCluster = false;
    let iconConfig;

    if (alertTypeZeroHasItems && alertTypeOneHasItems) {
      iconConfig = alertTypeConfig0;
      showIconForCluster = true;
    } else if (alertTypeZeroHasItems) {
      if (alertTypeZeroHasItems > 1) showIconForCluster = true;
      iconConfig = alertTypeConfig0;
    } else if (alertTypeOneHasItems) {
      if (alertTypeOneHasItems > 1) showIconForCluster = true;
      iconConfig = alertTypeConfig1;
    }

    return { showIconForCluster, iconConfig };
  }
}

TwoIconsLaneItem.propTypes = {
  iconConfigForMultipleAlertTypes: PropTypes.object.isRequired,
  eventData: PropTypes.object.isRequired
};
