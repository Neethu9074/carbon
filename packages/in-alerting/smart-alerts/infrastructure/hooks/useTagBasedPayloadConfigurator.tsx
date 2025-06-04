/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import { TimeConfig } from '@instana/types';

import { createTagBasedInfraPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
//@ts-expect-error
import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTagCatalogSubscription from 'in-infrastructure/subscriptions/getTagCatalog';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { days } from 'in-services/time';

const getInfraTagCatalog = getTagCatalogOnce(getTagCatalogSubscription, true, 'infrastructure');

export interface Props {
  metricName: string;
  regex: boolean;
  entityType: string;
}

export default function useTagBasedPayloadConfigurator({
  metricName,
  regex,
  entityType
}: Props): React.FunctionComponent<any> {
  return useMemo(() => {
    const modifiedTimeConfig = {
      windowSize: days.toMillis(1),
      autoRefresh: true
    } as TimeConfig;
    const matchAllRecentFilter = { timeConfig: modifiedTimeConfig, tagFilterExpression: EMPTY_EXPRESSION };

    return createTagBasedInfraPayloadConfigurator({
      getTagCatalog: () =>
        getInfraTagCatalog({
          filter: matchAllRecentFilter,
          ownerType: entityType,
          metric: metricName,
          regex,
          includeHidden: false
        }),
      getSuggestions: getTagValueSuggestions
    });
  }, [metricName, regex, entityType]);
}
