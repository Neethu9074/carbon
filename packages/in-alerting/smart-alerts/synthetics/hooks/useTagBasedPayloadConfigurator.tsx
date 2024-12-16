/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useMemo } from 'react';

import { Observable } from '@instana/observables';

import { createTagBasedPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { getTagSuggestions } from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import { getTagCatalog } from 'in-alerting/smart-alerts/synthetics/api/tagCatalog';
import { TimeConfig, Result, TagCatalog } from 'in-types';

export default function useTagBasedPayloadConfigurator(
  suggestionTimeConfig?: TimeConfig
): React.FunctionComponent<any> {
  return useMemo(() => {
    const customPayloadTagCatalog: Observable<Result<TagCatalog>> = getTagCatalog({
      useCase: 'SMART_ALERTS_CUSTOM_PAYLOAD'
    });

    return createTagBasedPayloadConfigurator({
      getTagCatalog: () => customPayloadTagCatalog,
      getSuggestions: args => getTagSuggestions(args, suggestionTimeConfig)
    });
  }, [suggestionTimeConfig]);
}
