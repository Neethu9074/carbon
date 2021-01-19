/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { datacenterDashboard } from 'in-vsphere/navigation/paths';

import { datacenterId } from 'in-vsphere/navigation/matrix';

export const datacenterIdUrlParameter = {
  path: datacenterDashboard,
  name: datacenterId
};
