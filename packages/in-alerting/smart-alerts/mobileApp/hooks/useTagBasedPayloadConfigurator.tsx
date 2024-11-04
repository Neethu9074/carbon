/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useMemo } from 'react';

import { Observable } from '@instana/observables';

import { createTagBasedMobileAppPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { getMobileAppTagSuggestions } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { MobileAppMonitoringBeaconType, Result, TagCatalog } from 'in-types';
import { getTagCatalog } from 'in-mobile-apps/api/tagCatalog';

export default function useTagBasedPayloadConfigurator(
  beaconType: MobileAppMonitoringBeaconType,
  mobileAppId: string
): React.FunctionComponent<any> {
  return useMemo(() => {
    const customPayloadTagCatalog: Observable<Result<TagCatalog>> = getTagCatalog({
      useCase: 'SMART_ALERTS_CUSTOM_PAYLOAD',
      beaconType
    });

    return createTagBasedMobileAppPayloadConfigurator({
      getTagCatalog: () => customPayloadTagCatalog,
      getSuggestions: args => getMobileAppTagSuggestions(args, mobileAppId, beaconType, undefined)
    });
  }, [beaconType, mobileAppId]);
}
