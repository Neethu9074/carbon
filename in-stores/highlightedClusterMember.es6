import createHighlightedClusterMemberSubscription from 'in-services/subscription/highlightedClusterMember';
import {focusedMoment$} from 'in-stores/timeline';


export default function getHighlightedClusterMember(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createHighlightedClusterMemberSubscription({snapshotId, time: focusedMoment}));
}
