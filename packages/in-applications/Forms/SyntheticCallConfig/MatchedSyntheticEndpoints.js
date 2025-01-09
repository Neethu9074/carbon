/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import { get } from 'lodash';
import React from 'react';

import {
  Link,
  DataTable as CarbonDataTable,
  TableSkeleton as CarbonTableSkeleton,
  LoadingSkeleton
} from '@instana/components';
import { TableLoadMoreRow } from '@instana/legacy';

import { OPERATOR_OR, createTagFilterExpression } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import getCallGroups from 'in-applications/subscriptions/getCallGroups';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { createGroupBy } from 'in-analyze/navigation/paths';
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

  const carbonHeaders = [
    {
      key: t('in-applications:labelEndpoints'),
      header: t('in-applications:labelEndpoints')
    },
    {
      key: t('in-applications:labelServicesAffected'),
      header: isInitialLoading ? (
        t('in-applications:labelServicesAffected')
      ) : (
        <div className={classNames(locals.th, locals.alignRight)}>{t('in-applications:labelServicesAffected')}</div>
      )
    }
  ];
  if (isInitialLoading) {
    return <CarbonTableSkeleton headers={carbonHeaders} columnCount={2} rowCount={3} />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={errors} />;
  }

  if (items.length === 0) {
    return <div className={locals.message}>{t('in-applications:forms.customSyntheticRule.messageNoMatchRule')}</div>;
  }

  const carbonRows = items.map(item => {
    return {
      id: item.name,
      [t('in-applications:labelEndpoints')]: <EndpointName item={item} />,
      [t('in-applications:labelServicesAffected')]: (
        <div className={classNames(locals.alignRight, locals.td)}>
          <ServicesAffected item={item} />
        </div>
      )
    };
  });
  return (
    <>
      <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
      {isLoading && <LoadingSkeleton className={locals.loadingSkeleton} />}
      {canLoadMore && (
        <TableLoadMoreRow className={locals.carbonLoadMore} loadMore={loadMore} cols={2} size="compact" />
      )}
    </>
  );
}

function EndpointName({ item }) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <Link
      href={getLinkToApplicationAnalyze({
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
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <Link
      href={getLinkToApplicationAnalyze({
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
    expressions: [
      tagFilter('endpoint.name', EQUALS, item.name, null, DESTINATION),
      tagFilter('call.is_synthetic', EQUALS, true)
    ]
  });
}
