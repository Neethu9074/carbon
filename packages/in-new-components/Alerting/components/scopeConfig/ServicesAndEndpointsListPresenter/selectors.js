/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
export function selectApplication(state, { applicationId }) {
  return state.userSelectionModel?.[applicationId];
}

export function selectService(state, { applicationId, serviceId }) {
  return state.userSelectionModel?.[applicationId]?.services[serviceId];
}

export function selectEndpoint(state, { applicationId, serviceId, endpointId }) {
  return state.userSelectionModel?.[applicationId]?.services[serviceId]?.endpoints[endpointId];
}
