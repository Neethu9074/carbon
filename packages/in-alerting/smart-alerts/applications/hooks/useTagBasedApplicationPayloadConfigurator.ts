/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode, useMemo } from 'react';

import { createTagBasedApplicationPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { getApplicationTagSuggestions } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { ApplicationBoundaryScope, ApplicationNode, TimeConfig } from 'in-types';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import { CALLS } from 'in-applications/analyze/metrics';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useTagBasedApplicationPayloadConfigurator(
  applications: Record<string, ApplicationNode>,
  boundaryScope: ApplicationBoundaryScope
): ReactNode {
  const timeConfig: TimeConfig = useTimeConfig();

  return useMemo(() => {
    const applicationTagCatalog = getApplicationTagCatalog({
      dataSource: CALLS,
      useCase: 'SMART_ALERTS_CUSTOM_PAYLOAD'
    })({ timeConfig });

    return createTagBasedApplicationPayloadConfigurator({
      getTagCatalog: () => applicationTagCatalog,
      getSuggestions: args => {
        return applicationTagCatalog.flatMap(tagCatalog => {
          const catalogTag = tagCatalog?.data?.tags?.find(tag => tag.name === args.name);
          const entity = catalogTag?.canApplyToDestination ? DESTINATION : NOT_APPLICABLE;
          return getApplicationTagSuggestions({ ...args, entity: entity }, undefined, applications, boundaryScope);
        });
      }
    });
  }, [applications, boundaryScope, timeConfig]);
}
