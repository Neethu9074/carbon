const verPatt = /([5-9]+\.[6-9]+\.([0-9]+)).*/;
export function isPerformanceDataAvailable(snapshot) {
  const version = snapshot.getIn(['data', 'variables.VERSION']);
  return verPatt.test(version) && parseInt(verPatt.exec(version)[2], 10) > 9;
}
