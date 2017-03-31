import { physicalViewStructure$ } from 'in-stores/view';

const mappedView$ = physicalViewStructure$.map(physicalView => {
  const groups = {};
  physicalView.children.forEach(group => {
    groups[group.id] = group.children.map(host => host.id);
  });
  return groups;
});

export default function getHostsInAvailabilityZone(zoneSnapshotId) {
  return mappedView$.map(groupsMap => groupsMap[zoneSnapshotId]);
}
