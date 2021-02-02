/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
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
import {
  OPERATOR_OR,
  createTagFilterExpression
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import getCallGroups from 'in-subscription/application/getCallGroups';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Link from 'in-components/Link';

import locals from './MatchedSyntheticEndpoints.mless';

export default function MatchedSyntheticEndpoints({ tagFilters }) {
  const timeConfig = useTimeConfig();

  const { canLoadMore, progress, loadMore, errors, items } = useCursorPagination(
    ({ cursor }) =>
      getCallGroups({
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
        tagFilterExpression: createTagFilterExpression(OPERATOR_OR, getTagFilterListForBackendSubscription(tagFilters)),
        includeSynthetic: true,
        group: {
          groupbyTag: 'endpoint.name'
        },
        useOrLogic: true
      }),
    [timeConfig, tagFilters]
  );

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
          <Th className={classNames(locals.th, locals.alignRight)}>Services Affected</Th>
        </Tr>
      </Thead>

      <Tbody>
        {items.map((item, index) => (
          <Tr key={index} size="compact" className={locals.tr}>
            <Td className={locals.td}>
              <EndpointName item={item} />
            </Td>
            <Td className={classNames(locals.alignRight, locals.td)}>
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
  const tagCatalog = useTagCatalog(getTagCatalog);
  return (
    <Link
      href$={
        tagCatalog &&
        getLinkToAnalyze({
          dataSource: 'calls',
          groupByTag: { name: 'endpoint.name', entity: entityTypes.DESTINATION },
          filters: getDefaultTagFilters(item),
          tagCatalog
        })
      }
    >
      {item.name}
    </Link>
  );
}

function ServicesAffected({ item }) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  return (
    <Link
      href$={
        tagCatalog &&
        getLinkToAnalyze({
          dataSource: 'calls',
          groupByTag: { name: 'service.name', entity: entityTypes.DESTINATION },
          filters: getDefaultTagFilters(item),
          tagCatalog
        })
      }
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
