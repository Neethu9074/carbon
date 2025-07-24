/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GetBusinessProcessQuery, Result, BusinessProcessItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

// A backend endpoint to fetch a SINGLE business process via the definition ID
// linked to the backend bpm_process_definition_id column, compared to getBusinessProcesses
// which fetches an ARRAY of business processes
export default createResultSubscriptionFactory<GetBusinessProcessQuery, Result<BusinessProcessItem>>({
  eventId: 'getBusinessProcess'
});
