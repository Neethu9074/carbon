/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CheckmarkFilled, ErrorFilled } from '@carbon/icons-react';
import React, { useState } from 'react';
import { get } from 'lodash';

import {
  DataTable,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from '@instana/carbon';
import {
  LocationStatus,
  PaginatedResult,
  Result,
  TagFilter,
  TagFilterExpression,
  TestResultListItem
} from '@instana/types';
import { ErrorEmptyState, NoDataEmptyState } from '@instana/ibm-products';
import { Pagination as CarbonPagination } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { TableSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  getRelativeTime,
  responseTimeColumnContent,
  retriesColumnContent
} from 'in-synthetics/dashboards/summary/tabs/results/ResultsList';
import { ExpandableResultListProps, ResultsHeader, runTypeCICD, runTypeScheduled } from 'in-synthetics/utils/constants';
import { massageLocationDisplayLabel } from 'in-synthetics/utils/massageLocationDisplayLabel';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { getErrors } from 'in-synthetics/dashboards/details/components/FailedRun';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { syntheticDetailsPath } from 'in-synthetics/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { runTypeTagName, testIdTagName } from 'in-synthetics/tags';
import { syntheticRunNowEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from './ExpandableResultList.mless';

export const ExpandableResultList = ({ test, runType, timeConfig }: ExpandableResultListProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const testId = test?.testResultCommonProperties?.testId;
  const testType = test?.testResultCommonProperties?.testCommonProperties?.type ?? '';
  const metrics = ['start_time', 'location_id', 'response_time', 'response_size', 'status', 'retries', 'errors'];
  if (['SSLCertificate', 'DNS'].includes(testType)) {
    metrics.splice(metrics.indexOf('response_size'), 1);
  }
  let baseTagFilters: TagFilter[] = [
    {
      stringValue: testId,
      name: testIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  let tagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };

  if (syntheticRunNowEnabled) {
    const runTypeTagFilterExpression: TagFilterExpression = {
      elements: [],
      logicalOperator: 'OR',
      type: 'EXPRESSION'
    };
    runTypeTagFilterExpression.elements.push({
      value: runType === runTypeCICD ? runTypeScheduled : runType,
      name: runTypeTagName,
      operator: runType === runTypeCICD ? NOT_EQUAL : EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
    tagFilterExpression.elements.push(runTypeTagFilterExpression);
  }
  const resultsList: Result<PaginatedResult<TestResultListItem>> =
    useObservable(
      getTestResultList({
        pagination: {
          page,
          pageSize
        },
        order: { by: 'start_time', direction: 'DESC' },
        syntheticMetrics: metrics,
        filter: {
          timeConfig,
          includeInternalCalls: false,
          includeSyntheticCalls: false,
          useLongTermDataOnly: false
        },
        tagFilters: baseTagFilters,
        tagFilterExpression
      }),
      [runType, page, pageSize, timeConfig]
    ) ?? pendingResult;

  const StartTimeColumn = ({ item }: { item: TestResultListItem }) => {
    const { location, createHref } = useNavigation();
    const locations = test?.testResultCommonProperties?.testCommonProperties?.locationStatusList ?? [];
    let locationDisplayLabels: string = '';
    let locationIds: string = '';
    if (locations?.length > 0) {
      locations.forEach((aLocation: LocationStatus) => {
        let tempLabel = aLocation.locationDisplayLabel ?? '';
        tempLabel = massageLocationDisplayLabel(tempLabel, aLocation.locationId);
        locationDisplayLabels =
          locationDisplayLabels.length === 0 ? tempLabel : locationDisplayLabels + ',' + tempLabel;
        locationIds = locationIds.length === 0 ? aLocation.locationId : locationIds + ',' + aLocation.locationId;
      });
    }
    location.pathname = syntheticDetailsPath;
    setOrDeleteMatrixKey(
      location,
      syntheticDetailsPath,
      'testId',
      test?.testResultCommonProperties?.testCommonProperties?.id
    );
    setOrDeleteMatrixKey(location, syntheticDetailsPath, 'id', item.testResultCommonProperties.id ?? '');
    setOrDeleteMatrixKey(location, syntheticDetailsPath, 'startTime', get(item, ['metrics', 'start_time', 0, 1]));
    setOrDeleteMatrixKey(location, syntheticDetailsPath, 'finishTime', get(item, ['metrics', 'start_time', 0, 0]));
    setOrDeleteMatrixKey(location, syntheticDetailsPath, 'status', get(item, ['metrics', 'status', 0, 1], 0));
    setOrDeleteMatrixKey(
      location,
      syntheticDetailsPath,
      'responseTime',
      get(item, ['metrics', 'response_time', 0, 1], 0)
    );
    setOrDeleteMatrixKey(
      location,
      syntheticDetailsPath,
      'responseSize',
      get(item, ['metrics', 'response_size', 0, 1], 0)
    );
    setOrDeleteMatrixKey(
      location,
      syntheticDetailsPath,
      'type',
      test?.testResultCommonProperties?.testCommonProperties?.type ?? ''
    );
    setOrDeleteMatrixKey(
      location,
      syntheticDetailsPath,
      'testLabel',
      test?.testResultCommonProperties?.testCommonProperties?.label
    );
    setOrDeleteMatrixKey(location, syntheticDetailsPath, 'locationDisplayLabels', locationDisplayLabels);
    setOrDeleteMatrixKey(location, syntheticDetailsPath, 'locationIds', locationIds);
    setOrDeleteMatrixKey(
      location,
      syntheticDetailsPath,
      'resultsLabel',
      item.testResultCommonProperties.locationDisplayLabel + ', ' + getRelativeTime(item)
    );
    setOrDeleteMatrixKey(location, syntheticDetailsPath, 'runType', runType);

    return <Link href={createHref(location)}>{getRelativeTime(item)}</Link>;
  };

  const headers: ResultsHeader[] = [
    {
      key: 'status',
      header: t('in-synthetics:dashboard.testList.resultsList.statusLabel'),
      width: '5',
      getContent: (item: TestResultListItem) => {
        const status = get(item, ['metrics', 'status', 0, 1], 0);
        return status === 1 ? <CheckmarkFilled className={locals.success} /> : <ErrorFilled className={locals.error} />;
      }
    },
    {
      key: 'startTime',
      header: t('in-synthetics:dashboard.testList.resultsList.startTimeLabel'),
      width: '20',
      getContent: (item: TestResultListItem) => <StartTimeColumn item={item} />
    },
    {
      key: 'responseTime',
      header: t('in-synthetics:dashboard.testList.resultsList.responseTimeLabel'),
      width: '15',
      getContent: (item: TestResultListItem) => responseTimeColumnContent(item)
    },
    {
      key: 'retryCount',
      header: t('in-synthetics:dashboard.testList.resultsList.retryCountLabel'),
      width: '10',
      getContent: (item: TestResultListItem) => retriesColumnContent(item)
    },
    {
      key: 'errorMessage',
      header: t('in-synthetics:dashboard.testList.resultsList.errorMessageLabel'),
      width: '50',
      getContent: () => {
        const errors = getErrors(resultsList) ?? [];
        let start: number = errors.search('errorMessage=');
        let end: number = errors.search('stackTrace=');
        let len: number = errors?.length;
        const errMsg = ['SSLCertificate', 'DNS'].includes(testType)
          ? errors.slice(start + 'errorMessage='.length, len - 1)
          : errors.slice(start + 'errorMessage='.length, end - '  '.length);
        return errors && errors?.length > 0 && <span>{errMsg}</span>;
      }
    }
  ];

  const rows =
    resultsList?.data?.items?.map(item => {
      return {
        id: item.testResultCommonProperties.id ?? generateUniqueShortId(),
        ...Object.fromEntries(headers.map(header => [header.key, header.getContent(item)]))
      };
    }) ?? [];

  const updatePageState = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <>
      <DataTable
        rows={rows}
        headers={headers}
        render={({ rows, headers, getHeaderProps, getRowProps, getCellProps }) => (
          <TableContainer>
            {resultsList?.progress?.loading ? (
              <TableSkeleton showHeader={false} zebra showToolbar={false} columnCount={headers.length} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map(header => {
                      const widthClass = `columnWidth-${(header as ResultsHeader).width}`;
                      return (
                        <TableHeader
                          {...getHeaderProps({ header })}
                          key={header.key}
                          className={widthClass ? locals[widthClass] : undefined}
                        >
                          {header.header}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow {...getRowProps({ row })} key={row.id} className={locals.rowWrapper}>
                      {row.cells.map((cell, i) => {
                        const widthClass = `columnWidth-${(headers[i] as ResultsHeader).width}`;
                        return (
                          <TableCell
                            {...getCellProps({ cell })}
                            key={cell.id}
                            className={widthClass ? locals[widthClass] : undefined}
                          >
                            {cell.value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={headers.length}>
                        {hasError(resultsList) ? (
                          <ErrorEmptyState
                            title={t('in-synthetics:dashboard.testList.resultsList.errorHeader')}
                            subtitle={resultsList?.errors[0].message}
                            className={locals.noDataTile}
                          />
                        ) : (
                          <NoDataEmptyState
                            title={t('in-synthetics:dashboard.testList.resultsList.noDataHeader')}
                            subtitle={t('in-synthetics:dashboard.testList.resultsList.noDataDescription')}
                            className={locals.noDataTile}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        )}
      />
      {resultsList?.data?.totalHits! > 10 && (
        <CarbonPagination
          totalItems={resultsList?.data?.totalHits}
          pageSize={pageSize}
          pageSizes={[10, 20, 30, 40, 50]}
          page={page}
          onChange={updatePageState}
        />
      )}
    </>
  );
};
