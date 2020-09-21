import React from 'react';

import { SourceLocation } from 'in-analyze/TraceDetail/components/CallDetails/components/LocationComponents';

export default {
  title: 'Templates|CallDetail/SourceLocation',
  component: SourceLocation
};

export function Default() {
  return <SourceLocation service={sourceService} snapshotId={snapshotId} entity={entity} />;
}

const sourceService = {
  id: '5042d146667518a1a5017644946b8650aafca44c',
  label: 'shop',
  types: [],
  technologies: [],
  entityType: 'SERVICE'
};

const entity = {
  id: 'SnyPublSegxLbTHXpH8tLHkl5EU',
  time: 1570594290000,
  label: 'Instana Demo - Shop Service 0.0.1',
  plugin: 'springbootApplicationContainer'
};

const snapshotId = 'SnyPublSegxLbTHXpH8tLHkl5EU';
