import {physicalViewStructure$} from 'in-stores/view';


const mappedView$ = physicalViewStructure$.map(physicalView => {
  const groups = {};
  physicalView.get('children').forEach(group => {
    groups[group.get('id')] = group.get('children').map(host => host.get('id'));
  });
  return groups;
});


export default function getHostsInAvailabilityZone(zoneSnapshotId) {
  return mappedView$.map(groupsMap => groupsMap[zoneSnapshotId]);
}
