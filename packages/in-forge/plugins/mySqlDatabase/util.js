/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const version5Patt = /([5]+\.[6-9]+\.([0-9]+)).*/;

const version8Patt = /([8]+\.[0-9]+\.([0-9]+)).*/;

export function isPerformanceDataAvailable(snapshot) {
  const sensorPerformanceSchemaStatus = snapshot.getIn(['data', 'sensorPerformanceSchemaStatus']);
  const version = snapshot.getIn(['data', 'variables.VERSION']);
  if (sensorPerformanceSchemaStatus !== 'OK') {
    return false;
  }
  if (version[0] === '5') {
    return version5Patt.test(version) && parseInt(version5Patt.exec(version)[2], 10) > 9;
  }
  return version8Patt.test(version);
}
