/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { hostDashboard } from 'in-windowshypervisor/navigation/paths';
import { hostId } from 'in-windowshypervisor/navigation/matrix';

interface UrlParameter {
  path: string;
  name: string;
}

export const hostIdUrlParameter: UrlParameter = {
  path: hostDashboard,
  name: hostId
};
