/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { GetPoPInstallationPropQuery, PoPInstallationProperties, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getPoPInstallationProperties = createResultSubscriptionFactory<
  GetPoPInstallationPropQuery,
  Result<PoPInstallationProperties>
>({ eventId: 'getPoPInstallationProperties', trackSubscriptionStatistics: true });

export default getPoPInstallationProperties;
