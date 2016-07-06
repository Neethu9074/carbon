import {getColorPool} from 'in-services/util/ColorGenerator';


const white = {r: 1, g: 1, b: 1};

export function getColor(snapshot) {
  const snapshotId = snapshot.get('id');

  if (snapshotId.indexOf('tomcat') !== -1 ||
      snapshotId.indexOf('mysql') !== -1) {
    return white;
  }

  return getColorPool('processes').getColorRGB(snapshot.get('plugin'));
}
