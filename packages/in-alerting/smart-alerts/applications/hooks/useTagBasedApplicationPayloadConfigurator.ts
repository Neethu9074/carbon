/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode, useMemo } from 'react';

import { createTagBasedPayloadConfigurator } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { CALLS } from 'in-applications/analyze/metrics';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';

export default function useTagBasedApplicationPayloadConfigurator(): ReactNode {
  const timeConfig: TimeConfig = useTimeConfig();

  return useMemo(() => {
    const applicationTagCatalog = getApplicationTagCatalog({
      dataSource: CALLS,
      useCase: 'SMART_ALERTS_CUSTOM_PAYLOAD'
    })({ timeConfig });

    return createTagBasedPayloadConfigurator({
      getTagCatalog: () => applicationTagCatalog
    });
  }, [timeConfig]);
}
