/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function hasNetworkMetrics(snapshot) {
  // See https://docs.docker.com/engine/reference/run/#network-settings for info on possible network modes.
  // In network modes host and container, we never get any network metrics. In network mode bridge we usually get some.
  // For user defined network modes (can be any arbitrary string) we simply do not know if we get network metrics, but
  // since they could exist we opt for showing the network chart etc. even if that means that we sometimes show a flat
  // chart.
  const networkMode = snapshot.getIn(['data', 'NetworkMode'], '');
  return networkMode && networkMode !== 'host' && networkMode !== 'none' && networkMode.indexOf('container:') !== 0;
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
