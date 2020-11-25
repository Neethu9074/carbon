import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  LoadMoreRow,
  HorizontalIndicatorRow
} from 'in-components/tables/sharedComponents';
import { OPERATOR_OR, createTagFilterExpression } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import getCallGroups from 'in-subscription/application/getCallGroups';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { joinClassNames } from 'in-services/util/classnames';
import { number } from 'in-services/formatters/number';
import cursorPaginated from 'in-hoc/cursorPaginated';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './MatchedSyntheticEndpoints.mless';

export default compose(
  connectTo({
    timeConfig: timeConfig$
  }),
  cursorPaginated({
    getResettingProps: () => ['timeConfig'],
    get: ({ tagFilters, cursor, timeConfig }) => {
      return getCallGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: 'group',
          direction: 'ASC'
        },
        filter: {
          timeConfig
        },
        metrics: {
          services: {
            metric: 'services',
            aggregation: 'DISTINCT_COUNT'
          }
        },
        tagFilterExpression: createTagFilterExpression(getTagFilterListForBackendSubscription(tagFilters), OPERATOR_OR),
        includeSynthetic: true,
        group: {
          groupbyTag: 'endpoint.name',
          groupbyTagEntity: 'DESTINATION'
        }
      });
    }
  })
)(MatchedSyntheticEndpoints);

function MatchedSyntheticEndpoints(props) {
  const { progress, errors, items, canLoadMore, loadMore } = props;

  const isInitialLoading = progress?.loading && items.length === 0;
  const isLoading = progress?.loading;
  const hasErrors = errors?.length > 0;

  if (isInitialLoading) {
    return <LoadingIndicator text="Loading data" height={100} />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={errors} />;
  }

  if (items.length === 0) {
    return <div className={locals.message}>No endpoint matches this rule.</div>;
  }

  return (
    <Table>
      <Thead>
        <Tr size="compact" className={locals.tr}>
          <Th className={locals.th}>Endpoints</Th>
          <Th className={joinClassNames(locals.th, locals.alignRight)}>Services Affected</Th>
        </Tr>
      </Thead>

      <Tbody>
        {items.map((item, index) => (
          <Tr key={index} size="compact" className={locals.tr}>
            <Td className={locals.td}>
              <EndpointName item={item} />
            </Td>
            <Td className={joinClassNames(locals.alignRight, locals.td)}>
              <ServicesAffected item={item} />
            </Td>
          </Tr>
        ))}
        {canLoadMore && <LoadMoreRow className={locals.loadMore} loadMore={loadMore} cols={2} size="compact" />}
        {isLoading && <HorizontalIndicatorRow cols={2} progress={progress} />}
      </Tbody>
    </Table>
  );
}

function EndpointName({ item }) {
  return (
    <Link
      href$={getLinkToAnalyze({
        dataSource: 'calls',
        groupByTag: { name: 'endpoint.name' },
        filters: getDefaultTagFilters(item)
      })}
    >
      {item.name}
    </Link>
  );
}

function ServicesAffected({ item }) {
  return (
    <Link
      href$={getLinkToAnalyze({
        dataSource: 'calls',
        groupByTag: { name: 'service.name' },
        filters: getDefaultTagFilters(item)
      })}
    >
      {number.compact(get(item, ['metrics', 'services', 0, 1]))}
    </Link>
  );
}

function getDefaultTagFilters(item) {
  return [
    { name: 'endpoint.name', value: item.name },
    { name: 'call.is_synthetic', value: 'true' },
    { name: 'include_synthetic', value: 'true' }
  ];
}
