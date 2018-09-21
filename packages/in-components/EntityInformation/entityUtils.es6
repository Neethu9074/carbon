const entityIdSeparator = '<|>';

export function parseEndpointEntityId(entityId) {
  // we will read the serviceId/endpointName out of the entityId, because these
  // informations are not provided in the event model, and because there is no
  // need to call the getEndpoint gRPC right now, since endpointId==endpontName.
  // these infos will be provided in the getEndpoint gRPC with the new
  // ServiceCatalogV2, which will introduce a proper endpointId, and where there
  // parent-serviceId (or even the parent-service-label) of this endpoint can be
  // easily retrieved.
  const endOfServiceId = entityId.indexOf(entityIdSeparator);
  const endpointName = entityId.substring(
    endOfServiceId + entityIdSeparator.length,
    entityId.lastIndexOf(entityIdSeparator)
  );
  return {
    serviceId: entityId.substring(0, endOfServiceId),
    name: endpointName ? endpointName : 'Unspecified'
  };
}
