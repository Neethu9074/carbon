import { combineLatest } from '@instana/observables';

import { emptyList } from 'in-services/fixedImmutables';
import { emptyArray } from 'in-services/fixedObjects';
import { always } from 'in-services/fixedStreams';
import { getEvent } from 'in-stores/events';

export default function getRecentEvents$(incident) {
  if (!incident) {
    return always(emptyArray);
  }

  return combineLatest(
    incident
      .get('recentEvents', emptyList)
      .toArray()
      .map(getEvent)
  )
    .nextFrame()
    .map(events =>
      events
        .filter(e => e && !e.isEmpty())
        .sort(
          (a, b) =>
            incident.getIn(['issueOrderMap', a.get('id')], a.get('start')) -
            incident.getIn(['issueOrderMap', b.get('id')], b.get('start'))
        )
    )
    .throttle(250);
}
