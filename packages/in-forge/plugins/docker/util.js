export function hasNetworkMetrics(snapshot) {
  return snapshot.getIn(['data', 'NetworkMode'], '') === 'bridge';
}

export function hasMemoryMetrics(snapshot) {
  const version = snapshot.getIn(['data', 'docker_version']);
  return version !== '1.11.0' && version !== '1.11.1';
}

export function isWithinKubernetes(snapshot) {
  const labels = snapshot.getIn(['data', 'Labels']);
  if (!labels || labels.size === 0) {
    return false;
  }

  return labels.some(
    (value, key) => key.indexOf('io.kubernetes.') !== -1 || key.indexOf('annotation.io.kubernetes') === 0
  );
}
