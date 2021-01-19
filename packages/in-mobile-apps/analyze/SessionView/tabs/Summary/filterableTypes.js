/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const types = {
  httpRequest: {
    short: 'HTTP',
    badgeLabel: 'HTTP',
    long: 'HTTP Requests',
    color: '#8900b3'
  },
  sessionStart: {
    short: 'Ses',
    badgeLabel: 'Ses',
    long: 'Session Start',
    color: '#F16528'
  },
  viewChange: {
    short: 'Tra',
    badgeLabel: 'Tra',
    long: 'View Transitions',
    color: '#91c200'
  },
  custom: {
    short: 'Cus',
    badgeLabel: 'Cus',
    long: 'Custom Events',
    color: '#009e89'
  }
};

export function getType(beacon) {
  return beacon.type;
}
