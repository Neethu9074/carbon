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
  ['DNS', 'DNS']
]);

export function getSyntheticType(displayType: string) {
  return syntheticTypeMap.has(displayType) ? syntheticTypeMap.get(displayType) : displayType;
}

export function getDisplayType(syntheticType: string) {
  for (let [key, value] of syntheticTypeMap.entries()) {
    if (value === syntheticType) {
      return key;
    } else {
      continue;
    }
  }
  //No display type found;
  return syntheticType;
}

export const apiSimpleTestType = 'HTTPAction';
export const dnsTestType = 'DNS';
export const sslCertificateTestType = 'SSLCertificate';
