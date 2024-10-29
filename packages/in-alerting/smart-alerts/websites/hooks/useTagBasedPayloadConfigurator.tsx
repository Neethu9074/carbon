/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode, useMemo } from 'react';

import { Observable } from '@instana/observables';

import { createTagBasedWebsitePayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { getWebsiteTagSuggestions } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { WebsiteBeaconType, Result, TagCatalog } from 'in-types';
import { getTagCatalog } from 'in-websites/api/tagCatalog';

export default function useTagBasedPayloadConfigurator(beaconType: WebsiteBeaconType, websiteId: string): ReactNode {
  return useMemo(() => {
    const customPayloadTagCatalog: Observable<Result<TagCatalog>> = getTagCatalog({
      useCase: 'SMART_ALERTS_CUSTOM_PAYLOAD',
      beaconType
    });

    return createTagBasedWebsitePayloadConfigurator({
      getTagCatalog: () => customPayloadTagCatalog,
      getSuggestions: args => getWebsiteTagSuggestions(args, websiteId, beaconType, undefined)
    });
  }, [beaconType, websiteId]);
}
