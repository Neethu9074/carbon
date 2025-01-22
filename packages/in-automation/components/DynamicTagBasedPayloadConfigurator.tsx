/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createTagBasedPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { getDynamicParameterTagCatalog } from 'in-automation/api';

export default createTagBasedPayloadConfigurator({
  getTagCatalog: getDynamicParameterTagCatalog,
  getSuggestions: ({ name, timeConfig, tagFilterExpression }) =>
    getTagSuggestions({
      tagName: name,
      entity: DESTINATION,
      filter: {
        includeInternalCalls: false,
        includeSyntheticCalls: false,
        timeConfig: timeConfig,
        useLongTermDataOnly: false
      },
      requestingSecondaryKeySuggestions: true,
      tagFilterExpression: tagFilterExpression ?? EMPTY_EXPRESSION
    })
});
