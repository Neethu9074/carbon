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
