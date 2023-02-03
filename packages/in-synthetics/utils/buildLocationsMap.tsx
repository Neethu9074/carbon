/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

export default function buildLocationsMap(locations: string[], locationLabel: string[]) {
  const map = new Map<string, string>();
  for (let i = 0; i < locations.length; i++) {
    map.set(locations[i], locationLabel[i]);
  }
  return map;
}
