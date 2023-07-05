/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

//key: Display type
//value: SyntheticType
const syntheticTypeMap = new Map<string, string>([
  ['API Simple', 'HTTPAction'],
  ['API Script', 'HTTPScript'],
  ['Webpage Simple', 'WebpageAction'],
  ['Webpage Script', 'WebpageScript'],
  ['Browser Script', 'BrowserScript'],
  ['DNS Action', 'DNSAction']
]);

export function getSyntheticType(displayType: string) {
  return syntheticTypeMap.has(displayType) ? syntheticTypeMap.get(displayType) : null;
}

export function getDisplayType(syntheticType: string) {
  for (let value of syntheticTypeMap.values()) {
    if (value === syntheticType) {
      return value;
    } else {
      continue;
    }
  }
  //No display type found;
  return null;
}
