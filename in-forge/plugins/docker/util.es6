export function hasNetworkMetrics(snapshot) {
  return snapshot.getIn(['data', 'NetworkMode'], '') === 'bridge';
}

export function hasMemoryMetrics(snapshot) {
  const version = snapshot.getIn(['data', 'docker_version']);
  return version !== '1.11.0' && version !== '1.11.1';
}
