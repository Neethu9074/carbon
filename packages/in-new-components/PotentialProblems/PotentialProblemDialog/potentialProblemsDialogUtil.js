export function getType({ applicationLabel, serviceLabel, endpointLabel }) {
  if (endpointLabel) return 'endpoint';
  if (serviceLabel) return 'service';
  if (applicationLabel) return 'application';
}

export function getIconByType(type) {
  if (type === 'endpoint') return 'lib_application_endpoint';
  if (type === 'service') return 'lib_application_service';
  if (type === 'application') return 'lib_application_invert';
}
