import { applicationId, serviceId, endpointId } from 'in-analyze/navigation/matrix';

export const APPLICATION = {
  id: applicationId,
  name: 'application.name',
  technicalName: 'application.id',
  label: 'Application Name',
  icon: 'lib_application'
};

export const SERVICE = {
  id: serviceId,
  name: 'service.name',
  technicalName: 'service.name',
  label: 'Service Name',
  icon: 'lib_application_service'
};

export const ENDPOINT = {
  id: endpointId,
  name: 'endpoint.name',
  technicalName: 'endpoint.name',
  label: 'Endpoint Name',
  icon: 'lib_application_endpoint'
};
