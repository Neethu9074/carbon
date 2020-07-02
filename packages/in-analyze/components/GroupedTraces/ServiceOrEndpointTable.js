import { compose } from 'recompose';

import ServiceOrEndpointTablePresenter from 'in-analyze/components/GroupedTraces/ServiceOrEndpointTablePresenter';
import { entityTypes, getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getCallGroups from 'in-subscription/application/getCallGroups';
import cursorPaginated from 'in-hoc/cursorPaginated';

export default compose(
  cursorPaginated({
    getResettingProps: () => ['filters'],
    get: ({ tagFilters, cursor, filters }) => {
      const tagFilterListForBackendSubscription = getTagFilterListForBackendSubscription(tagFilters ?? []);
      const timeConfig = filters.timeConfig;
      const filterGroup = filters.group ?? {};

      return getCallGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: `calls_SUM_Agg`,
          direction: 'DESC'
        },
        filter: {
          timeConfig
        },
        metrics: {
          calls_SUM_Agg: {
            metric: 'calls',
            aggregation: 'SUM'
          }
        },
        tagFilters: tagFilterListForBackendSubscription,
        group: {
          groupbyTag: filterGroup.name ?? null,
          groupbyTagSecondLevelKey: filterGroup.value ?? '',
          groupbyTagEntity: filterGroup.entity ?? entityTypes.NOT_APPLICABLE
        },
        queryPrecision: 'FULL'
      });
    }
  })
)(ServiceOrEndpointTablePresenter);
