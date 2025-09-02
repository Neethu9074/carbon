/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const IdMapper = [
  {
    id: 'kubecost',
    tourId: '2093256'
  },
  {
    id: 'logging',
    tourId: '2094310'
  },
  {
    id: 'agent',
    tourId: '1643696'
  },
  {
    id: 'applications',
    tourId: '1643766'
  },
  {
    id: 'invite-users',
    tourId: '1643805'
  },
  {
    id: 'custom-dashboards',
    tourId: '1644664'
  },
  {
    id: 'maintenance-window',
    tourId: '1644665'
  },
  {
    id: 'websites',
    tourId: '1644666'
  },
  {
    id: 'turbo',
    tourId: '2103008'
  },
  {
    id: 'concert',
    tourId: '2103195'
  },
  {
    id: 'smart-alerts',
    tourId: '1643803'
  }
];

export const getIdByTourId = (tourId: string): string | undefined => {
  const mapping = IdMapper.find(item => item.tourId === tourId);
  return mapping?.id;
};
