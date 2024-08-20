/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import featureFlags from '../../dev/featureFlags';
import searchFieldValues from './searchFieldValues.json';

window.instana = {
  user: {
    email: 'tom@example.com',
    tenants: [
      {
        tenantKey: 'instana',
        role: {
          canConfigureEventsAndAlerts: true
        }
      }
    ]
  },
  searchFields: searchFieldValues,
  config: {
    featureFlags,
    tenant: 'instana',
    tenantUnit: 'test',
    environment: 'internal'
  },
  build: {
    revision: '85373525d145604cda61cf7544d376436c5c49d5',
    date: '2019-01-28T09:03:31.258Z',
    tag: '1.0.0'
  },
  termsAndPrivacySettings: {}
};
