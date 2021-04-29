/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
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
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import getCallGroups from 'in-subscription/application/getCallGroups';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { tagFilter } from 'in-analyze/navigation/matrix';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

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
    return <LoadingIndicator text={t('in-applications:loadingData')} height={100} />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={errors} />;
  }

  if (items.length === 0) {
    return <div className={locals.message}>{t('in-applications:forms.customSyntheticRule.messageNoMatchRule')}</div>;
  }

  return (
    <Table>
      <Thead>
        <Tr size="compact" className={locals.tr}>
          <Th className={locals.th}>{t('in-applications:labelEndpoints')}</Th>
          <Th className={classNames(locals.th, locals.alignRight)}>{t('in-applications:labelServicesAffected')}</Th>
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
  return (
    <Link
      href$={getLinkToAnalyze({
        dataSource: 'calls',
        groupBy: createGroupBy('endpoint.name', DESTINATION),
        formModel: getDefaultFormModel(item),
        hiddenCalls: { includeSynthetic: true }
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
        groupBy: createGroupBy('service.name', DESTINATION),
        formModel: getDefaultFormModel(item),
        hiddenCalls: { includeSynthetic: true }
      })}
    >
      {number.compact(get(item, ['metrics', 'services', 0, 1]))}
    </Link>
  );
}

function getDefaultFormModel(item) {
  return joinExpressions({
    expressions: [tagFilter('endpoint.name', EQUALS, item.name), tagFilter('call.is_synthetic', EQUALS, true)]
  });
}
