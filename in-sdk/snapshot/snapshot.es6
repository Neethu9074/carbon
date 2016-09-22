export {registerSnapshotDefinition, getSnapshotDefinition} from 'in-sdk/snapshot/registry';
export {addLabelFinder, getLabel, getIcon} from 'in-sdk/snapshot/legacy';

import {getSnapshotDefinition} from 'in-sdk/snapshot/registry';


export function getChartWiggleRoom(plugin) {
  const chartWiggleRoom = getSnapshotDefinition(plugin).chartWiggleRoom;
  if (chartWiggleRoom == null) {
    return 5000;
  }
  return chartWiggleRoom;
}


export function getPower(snapshot) {
  const get = getSnapshotDefinition(snapshot.get('plugin')).getPower;
  if (get) {
    return get(snapshot);
  }
  return -1;
}


export function getShowZoneInSidebarHeader(plugin) {
  return getSnapshotDefinition(plugin).showZoneInSidebarHeader === true;
}


export function supportsCodeView(snapshot, file) {
  const snapshotDefinition = getSnapshotDefinition(snapshot.get('plugin'));
  const supports = snapshotDefinition.supportsCodeView;
  if (!snapshotDefinition.getCodeView) {
    return false;
  } else if (supports == null) {
    return true;
  } else if (supports === true) {
    return true;
  } else if (supports === false) {
    return false;
  }

  return supports(snapshot, file);
}


export function getCodeView(snapshot, file) {
  return getSnapshotDefinition(snapshot.get('plugin')).getCodeView(snapshot, file);
}
