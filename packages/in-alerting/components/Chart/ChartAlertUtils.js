/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getSumOfAlertsPerCluster({ index, alertEvents, clusterWidthPixels, xBackBuffer }) {
  const clusterFrom = index * clusterWidthPixels;
  const clusterTo = (index + 1) * clusterWidthPixels;

  return alertEvents
    .filter(([timestamp]) => {
      const timestampPosition = xBackBuffer.getRange(timestamp);
      return timestampPosition >= clusterFrom && timestampPosition < clusterTo;
    })
    .reduce((acc, [, numberOfAlerts]) => acc + numberOfAlerts, 0);
}
