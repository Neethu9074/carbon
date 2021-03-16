/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const verPatt = /([5-9]+\.[6-9]+\.([0-9]+)).*/;
export function isPerformanceDataAvailable(snapshot) {
  const sensorPerformanceSchemaStatus = snapshot.getIn(['data', 'sensorPerformanceSchemaStatus']);
  const version = snapshot.getIn(['data', 'variables.VERSION']);
  if (sensorPerformanceSchemaStatus !== 'OK') {
    return false;
  }
  return verPatt.test(version) && parseInt(verPatt.exec(version)[2], 10) > 9;
}
