/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode, useMemo } from 'react';

import { Observable } from '@instana/observables';

import { createTagBasedPayloadConfigurator } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import { BeaconType, Result, TagCatalog } from 'in-types';

export default function useTagBasedPayloadConfigurator(beaconType: BeaconType): ReactNode {
  return useMemo(() => {
    const customPayloadTagCatalog: Observable<Result<TagCatalog>> = getTagCatalog({
      useCase: 'SMART_ALERTS_CUSTOM_PAYLOAD',
      beaconType
    });

    return createTagBasedPayloadConfigurator({
      getTagCatalog: () => customPayloadTagCatalog
    });
  }, [beaconType]);
}
