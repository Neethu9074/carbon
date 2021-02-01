/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
export function getApplication(state, applicationId) {
  return state?.[applicationId];
}

export function getService(application, serviceId) {
  return application?.services[serviceId];
}

export function getEndpoint(service, endpointId) {
  return service?.endpoints[endpointId];
}
