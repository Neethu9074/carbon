/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

export function isWithinKubernetes(snapshot) {
  const labels = snapshot.getIn(['data', 'labels']);
  if (!labels || labels.size === 0) {
    return false;
  }

  return labels.some(
    (value, key) => key.indexOf('io.kubernetes.') !== -1 || key.indexOf('annotation.io.kubernetes') === 0
  );
}
