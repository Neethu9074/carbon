import React from 'react';

import { DestinationLocation } from 'in-analyze/TraceDetail/components/CallDetails/components/LocationComponents';

export default {
  title: 'Templates/CallDetail/DestinationLocation',
  component: DestinationLocation
};

export function Default() {
  return (
    <DestinationLocation
      service={destinationService}
      endpoint={destinationEndpoint}
      entity={entity}
      snapshotId={snapshotId}
    />
  );
}

const destinationService = {
  id: '5042d146667518a1a5017644946b8650aafca44c',
  label: 'shop',
  types: [],
  technologies: [],
  entityType: 'SERVICE'
};

const destinationEndpoint = {
  id: 'KkQNCKd9LdBMqqmfGVuhtVnXsAI',
  label: 'GET /shop',
  type: 'HTTP',
  serviceId: '',
  technologies: 'Array[0]',
  entityType: 'ENDPOINT'
};

const entity = {
  id: 'SnyPublSegxLbTHXpH8tLHkl5EU',
  time: 1570594290000,
  label: 'Instana Demo - Shop Service 0.0.1',
  plugin: 'springbootApplicationContainer'
};

const snapshotId = 'SnyPublSegxLbTHXpH8tLHkl5EU';
