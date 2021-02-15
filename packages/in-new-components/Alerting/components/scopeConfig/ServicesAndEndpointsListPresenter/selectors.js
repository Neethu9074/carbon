/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
export function selectApplication(state, { applicationId }) {
  return state?.[applicationId];
}

export function selectService(state, { applicationId, serviceId }) {
  return state?.[applicationId]?.services[serviceId];
}

export function selectEndpoint(state, { applicationId, serviceId, endpointId }) {
  return state?.[applicationId]?.services[serviceId]?.endpoints[endpointId];
}
