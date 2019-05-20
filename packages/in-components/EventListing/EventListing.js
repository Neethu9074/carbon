import { combineLatest } from 'reactive-observables';

import EventListingPresenter from 'in-components/EventListing/EventListingPresenter';
import { getEvent, getHealthInfoAtFocusedMoment } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    events: getEventsForEntityAtFocusedMoment(props.snapshotId)
  };
}, EventListingPresenter);

function getEventsForEntityAtFocusedMoment(snapshotId) {
  return getHealthInfoAtFocusedMoment(snapshotId).flatMap(healthInfo =>
    combineLatest(
      healthInfo
        .get('eventIds')
        .toArray()
        .map(getEvent)
    )
  );
}
