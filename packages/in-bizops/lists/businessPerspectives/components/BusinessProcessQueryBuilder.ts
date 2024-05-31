/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getBusinessMonitoringTagCatalog } from 'in-bizops/api/catalog';
import { successObservableFactory } from 'in-services/util/result';
import { createQueryBuilder } from 'in-components/QueryBuilder';

export const BusinessProcessQueryBuilder = createQueryBuilder({
  getTagCatalog: getBusinessMonitoringTagCatalog,
  getSuggestions: successObservableFactory({
    suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
    totalHits: 42
  })
}).QueryBuilder;
