import { just } from 'reactive-observables';

import getWebsiteBeacons from 'in-websites/subscriptions/getWebsiteBeacons';
import { minutes } from 'in-services/time';

export function getCorrelatedWebsiteBeacons({ traceId, correlationId: beaconId, startTime }) {
  return executeInOrder(
    [
      // When correlation works via the Server-Timing response header OR for old tracers
      // when they take the value from X-INSTANA-T as the trace ID, i.e. those tracers
      // that do not support the X-INSTANA-L extensions.
      getWebsiteBeaconsRequestConfiguration(
        [{ name: 'beacon.backend.traceId', stringValue: traceId, operator: 'EQUALS' }],
        startTime
      ),
      // When correlation works via extended X-INSTANA-L header
      beaconId &&
        getWebsiteBeaconsRequestConfiguration(
          [{ name: 'beacon.id', stringValue: beaconId, operator: 'EQUALS' }],
          startTime
        )
    ].filter(Boolean)
  );
}

function executeInOrder(websiteBeaconsRequestConfigurations, index = 0) {
  return getWebsiteBeacons(websiteBeaconsRequestConfigurations[index]).flatMap(result => {
    // Still loading? Retain the loading state!
    if (
      result.progress.loading ||
      // Some data found? Great: Show it!
      result.data?.totalHits > 0 ||
      // Last configuration we can try? Forward the "not-found" case
      websiteBeaconsRequestConfigurations.length === index + 1
    ) {
      return just(result);
    }

    return executeInOrder(websiteBeaconsRequestConfigurations, index + 1);
  });
}
function getWebsiteBeaconsRequestConfiguration(tagFilters, startTime) {
  return {
    tagFilters,
    timeConfig: {
      windowSize: minutes.toMillis(20),
      to: startTime + minutes.toMillis(10),
      focusedMoment: startTime + minutes.toMillis(10)
    },
    order: {
      by: 'beacon.timestamp',
      direction: 'DESC'
    },
    pagination: {
      retrievalSize: 1
    }
  };
}
